#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req$REQUEST_METHOD == "OPTIONS") return(res)
  forward()
}

# plumber.R
library(plumber)
library(readxl)
library(data.table)
library(lubridate)

state_abbr_to_name <- c(
  AL = "Alabama", AK = "Alaska", AZ = "Arizona", AR = "Arkansas", CA = "California",
  CO = "Colorado", CT = "Connecticut", DE = "Delaware", FL = "Florida", GA = "Georgia",
  HI = "Hawaii", ID = "Idaho", IL = "Illinois", IN = "Indiana", IA = "Iowa",
  KS = "Kansas", KY = "Kentucky", LA = "Louisiana", ME = "Maine", MD = "Maryland",
  MA = "Massachusetts", MI = "Michigan", MN = "Minnesota", MS = "Mississippi", MO = "Missouri",
  MT = "Montana", NE = "Nebraska", NV = "Nevada", NH = "New Hampshire", NJ = "New Jersey",
  NM = "New Mexico", NY = "New York", NC = "North Carolina", ND = "North Dakota", OH = "Ohio",
  OK = "Oklahoma", OR = "Oregon", PA = "Pennsylvania", RI = "Rhode Island", SC = "South Carolina",
  SD = "South Dakota", TN = "Tennessee", TX = "Texas", UT = "Utah", VT = "Vermont",
  VA = "Virginia", WA = "Washington", WV = "West Virginia", WI = "Wisconsin", WY = "Wyoming",
  DC = "District of Columbia"
)

# Load data at API start
hpi <- fread("C:/Users/maggi/unnecessary-pmi-app/pmi-api/fmhpi_master_file.csv")
zip_state <- fread("C:/Users/maggi/unnecessary-pmi-app/pmi-api/zip_to_state_2017.csv")
zip_cbsa <- readxl::read_excel("C:/Users/maggi/unnecessary-pmi-app/pmi-api/ZIP_CBSA_122018.xlsx")
hpi$cbsa_code <- as.character(hpi$GEO_Code)

fred_rates <- fread("C:/Users/maggi/unnecessary-pmi-app/pmi-api/MORTGAGE30US.csv")
setnames(fred_rates, "observation_date", "DATE")
fred_rates[, DATE := as.Date(DATE)]
fred_rates[, Year := year(DATE)]
fred_rates[, Month := month(DATE)]

# Lookup helpers
get_cbsa_from_zip <- function(zip) {
  row <- zip_cbsa[zip_cbsa$zip == as.integer(zip), ]
  if (nrow(row) == 0) return(NA)
  return(as.character(row$cbsa[which.max(row$tot_ratio)]))
}

get_state_from_zip <- function(zip) {
  row <- zip_state[ZIP == as.integer(zip)]
  if (nrow(row) == 0) stop("ZIP not found in state lookup")
  return(row$STATE[1])
}

get_average_interest_rate <- function(year, month) {
  rate_row <- fred_rates[Year == year & Month == month, ]
  if (nrow(rate_row) == 0) {
    return(0.045)  # fallback if no match found
  }
  return(as.numeric(rate_row$MORTGAGE30US[1]) / 100)  # convert to decimal (e.g., 7.25 → 0.0725)
}

# Helpers
get_latest_hpi_date <- function(hpi) {
  latest_row <- hpi[which.max(hpi$Year * 100 + hpi$Month), ]
  return(list(current_year = latest_row$Year, current_month = latest_row$Month))
}

calculate_months_elapsed <- function(purchase_year, purchase_month, current_year, current_month) {
  months_elapsed <- (current_year - purchase_year) * 12 + (current_month - purchase_month)
  if (months_elapsed < 0) stop("Purchase date is in the future.")
  return(months_elapsed)
}

calculate_current_home_value <- function(purchase_price, index_start, index_now) {
  appreciation_factor <- index_now / index_start
  return(round(purchase_price * appreciation_factor, 2))
}

calculate_unpaid_balance <- function(purchase_price, down_payment, annual_rate, months_elapsed, additional_payments) {
  original_mortgage <- purchase_price - down_payment
  monthly_rate <- annual_rate / 12
  total_payments <- 360
  remaining_balance <- original_mortgage * ((1 + monthly_rate)^total_payments - (1 + monthly_rate)^months_elapsed) / ((1 + monthly_rate)^total_payments - 1)
  adjusted_remaining_balance <- remaining_balance - additional_payments
  return(round(adjusted_remaining_balance, 2))
}

estimate_pmi_cancellation_months <- function(
  purchase_price,
  down_payment,
  annual_rate,
  purchase_year,
  purchase_month,
  months_elapsed,
  additional_payments = 0,
  credit_score_tier = NULL
) {
  original_mortgage <- purchase_price - down_payment
  monthly_rate <- annual_rate / 12
  total_payments <- 360

  monthly_payment <- original_mortgage * monthly_rate / (1 - (1 + monthly_rate)^(-total_payments))

  current_balance <- calculate_unpaid_balance(
    purchase_price,
    down_payment,
    annual_rate,
    months_elapsed,
    additional_payments
  )

  balance <- original_mortgage
  schedule <- numeric(total_payments + 1)
  schedule[1] <- balance

  for (i in 1:total_payments) {
    interest <- balance * monthly_rate
    principal <- monthly_payment - interest
    balance <- balance - principal
    schedule[i + 1] <- balance
  }

  current_index <- which.min(abs(schedule - current_balance))
  future_schedule <- schedule[(current_index + 1):(total_payments + 1)]
  future_months <- (current_index):(total_payments)

  target_80 <- 0.80 * purchase_price
  target_78 <- 0.78 * purchase_price

  month_80 <- future_months[which(future_schedule <= target_80)[1]]
  month_78 <- future_months[which(future_schedule <= target_78)[1]]

  orig_date <- as.Date(sprintf("%04d-%02d-01", purchase_year, purchase_month))
  cancel_request_date <- format(orig_date %m+% months(month_80), "%B %Y")
  auto_cancel_date <- format(orig_date %m+% months(month_78), "%B %Y")

  # === PMI Estimation (between now and auto-cancel) ===
  map_score_tier_to_numeric <- function(score_tier) {
    if (is.null(score_tier)) return(NA)
    switch(score_tier,
      "Excellent (760+)" = 760,
      "Great (720 - 759)" = 730,
      "Good (660 - 719)" = 690,
      "Fair (Below 660)" = 640,
      NA
    )
  }

  lookup_mi_premium <- function(oltv, score) {
    if (is.na(oltv) || is.na(score) || oltv <= 80) return(0)

    get_rate <- function(min_oltv, max_oltv, cutoffs) {
      for (i in seq_along(cutoffs)) {
        if (oltv > min_oltv && oltv <= max_oltv &&
            score >= cutoffs[[i]][1] && score < cutoffs[[i]][2]) {
          return(cutoffs[[i]][3])
        }
      }
      return(0.0055 / 12)
    }

    cutoffs_85 <- list(
      c(760, Inf, 0.0019 / 12), c(740, 760, 0.0020 / 12),
      c(720, 740, 0.0023 / 12), c(700, 720, 0.0025 / 12),
      c(680, 700, 0.0028 / 12), c(660, 680, 0.0038 / 12),
      c(640, 660, 0.0040 / 12), c(620, 640, 0.0044 / 12)
    )
    cutoffs_90 <- list(
      c(760, Inf, 0.0028 / 12), c(740, 760, 0.0038 / 12),
      c(720, 740, 0.0046 / 12), c(700, 720, 0.0055 / 12),
      c(680, 700, 0.0065 / 12), c(660, 680, 0.0090 / 12),
      c(640, 660, 0.0091 / 12), c(620, 640, 0.0094 / 12)
    )
    cutoffs_95 <- list(
      c(760, Inf, 0.0038 / 12), c(740, 760, 0.0053 / 12),
      c(720, 740, 0.0066 / 12), c(700, 720, 0.0078 / 12),
      c(680, 700, 0.0096 / 12), c(660, 680, 0.0128 / 12),
      c(640, 660, 0.0133 / 12), c(620, 640, 0.0142 / 12)
    )
    cutoffs_97 <- list(
      c(760, Inf, 0.0058 / 12), c(740, 760, 0.0070 / 12),
      c(720, 740, 0.0087 / 12), c(700, 720, 0.0099 / 12),
      c(680, 700, 0.0121 / 12), c(660, 680, 0.0154 / 12),
      c(640, 660, 0.0165 / 12), c(620, 640, 0.0186 / 12)
    )

    if (oltv <= 85) return(get_rate(80, 85, cutoffs_85))
    if (oltv <= 90) return(get_rate(85, 90, cutoffs_90))
    if (oltv <= 95) return(get_rate(90, 95, cutoffs_95))
    if (oltv <= 97) return(get_rate(95, 97, cutoffs_97))

    return(0.0055 / 12)
  }

  numeric_score <- map_score_tier_to_numeric(credit_score_tier)
  oltv_orig <- original_mortgage / purchase_price * 100
  fixed_prem_rate <- lookup_mi_premium(oltv_orig, numeric_score)
  total_mi_paid <- 0

  for (i in (months_elapsed + 1):month_78) {
    balance <- schedule[i + 1]
    total_mi_paid <- total_mi_paid + balance * fixed_prem_rate
  }

  return(list(
    cancel_request_date = cancel_request_date,
    auto_cancel_date = auto_cancel_date,
    auto_cancel_month = month_78,
    estimated_pmi_savings = round(total_mi_paid, 2)
  ))
}


calculate_ltv_metrics <- function(unpaid_balance, current_home_value, purchase_price) {
  eltv <- unpaid_balance / current_home_value
  oltv <- unpaid_balance / purchase_price
  return(list(eltv = round(eltv, 4), oltv = round(oltv, 4)))
}

calculate_delinquency_flag <- function(delinquent, late_30, late_60) {
  return(delinquent || late_30 || late_60)
}

determine_eligibility_group <- function(months_elapsed, eltv, oltv, equity_boost, delinquency) {
  # 1. Always check delinquency first
  if (delinquency) {
    return(list(
      eligibility_level = "UNLIKELY",
      eligibility_message = paste(
        "Servicers generally require borrowers to be <strong>current</strong> on their mortgage and have no missed payments for at least <strong>one year</strong> before considering PMI cancellation."
      )
    ))
  }

  # 2. Too early without equity boost
  if (months_elapsed < 24 && !equity_boost) {
    return(list(
      eligibility_level = "UNLIKELY",
      eligibility_message = paste(
      "Servicers generally require borrowers to make at least <strong>two years</strong> of payments before considering PMI cancellation."
      )
    ))
  } 

  # 3. Too early with equity boost, but not enough equity
  if (months_elapsed < 24 && equity_boost && eltv > 0.75) {
    return(list(
      eligibility_level = "UNLIKELY",
      eligibility_message = paste(
      "Servicers generally require <strong>at least two years</strong> of payments and home equity of at least <strong>25%</strong> to consider PMI cancellation on mortgages <strong>less than five years</strong> old"
      )
    ))
  }

  # 4. Auto-cancellation conditions
  if (oltv <= 0.78 || months_elapsed >= 180) {
    return(list(
      eligibility_level = "VERY LIKELY",
      eligibility_message = paste(
      "By law, PMI should be automatically cancelled once your loan reaches <strong>78%</strong> of the original purchase price. <br><br>",
      "If you're still being charged, contact your mortgage servicer and ask why PMI hasn’t been removed."
      )
    ))
  }

  # 5. Request-cancel window based on original value
  if (oltv > 0.78 && oltv <= 0.80 && months_elapsed < 180) {
    return(list(
      eligibility_level = "LIKELY",
      eligibility_message = paste(
      "Once your equity reaches <strong>20%</strong> of the original purchase price, you can ask your servicer to remove PMI."
      )
    ))
  }

# 6A. Not enough equity yet for loan under 5 years
if (eltv > 0.75 && months_elapsed < 60) {
  return(list(
    eligibility_level = "UNLIKELY",
    eligibility_message = paste(
      "For loans less than five years old, servicers generally require home equity of at least <strong>25%</strong> before approving PMI cancellation."
    )
  ))
}

# 6B. Still too much loan remaining
if (eltv > 0.80) {
  return(list(
    eligibility_level = "UNLIKELY",
    eligibility_message = paste(
      "Servicers generally require home equity of at least <strong>20%</strong> before approving PMI cancellation."
    )
  ))
}

# 7A. Likely eligible – under 5 years with 25%+ equity
if (eltv <= 0.75 && months_elapsed >= 24 && months_elapsed < 60) {
  return(list(
    eligibility_level = "LIKELY",
    eligibility_message = paste(
      "Servicers generally allow PMI cancellation on loans less than five years old if you've built at least <strong>25%</strong> equity."
    )
  ))
}

# 7B. Likely eligible – 5+ years with 20%+ equity
if (eltv <= 0.80 && months_elapsed >= 60) {
  return(list(
    eligibility_level = "LIKELY",
    eligibility_message = paste(
      "Servicers generally allow cancellation if you've built at least <strong>20%</strong> equity."
    )
  ))
}

   # 8. Equity boost less than 24 months, but enough equity
  if (
    (eltv <= 0.75 && months_elapsed < 24 && equity_boost)
  ) {
    return(list(
      eligibility_level = "POSSIBLY",
       eligibility_message = paste(
      "For loans less than two years old, PMI cancellation is sometimes allowed if you've built at least <strong>25%</strong> equity through renovations or extra payments."
    )
    ))
  }

  # Default fallback (should never hit this if all above is complete)
  return(list(
    eligibility_level = "UNLIKELY",
    eligibility_message = "You're probably not eligible to cancel PMI yet. Keep making on-time payments and check back again—or talk to your servicer for more details."
  ))
}




#* @post /pmi-check
function(
  zip,
  purchase_year, purchase_month,
  purchase_price, down_payment,
  interest_rate = NA,
  credit_score = NULL,
  equity_boost = FALSE,
  additional_payments = NA,
  renovation_value = NA,
  currently_delinquent = FALSE,
  late_30_in_12mo = FALSE,
  late_60_in_24mo = FALSE
) {
  zip <- as.character(zip)
  purchase_year <- as.integer(purchase_year)
  purchase_month <- as.integer(purchase_month)
  purchase_price <- as.numeric(purchase_price)
  down_payment <- as.numeric(down_payment)
  interest_rate <- as.numeric(interest_rate)
  equity_boost <- as.logical(equity_boost)
  additional_payments <- as.numeric(additional_payments)
  renovation_value <- as.numeric(renovation_value)
  delinquency <- calculate_delinquency_flag(
    as.logical(currently_delinquent),
    as.logical(late_30_in_12mo),
    as.logical(late_60_in_24mo)
  )

if (is.na(interest_rate)) {
  interest_rate <- get_average_interest_rate(purchase_year, purchase_month)
}

  cbsa <- get_cbsa_from_zip(zip)
  cbsa_name <- NA
if (!is.na(cbsa) && cbsa != "99999") {
  cbsa_row <- hpi[hpi$GEO_Type == "CBSA" & hpi$GEO_Code == cbsa, .(GEO_Name)]
  if (nrow(cbsa_row) > 0) cbsa_name <- cbsa_row$GEO_Name[1]
}
  state <- get_state_from_zip(zip)
  state_name <- state_abbr_to_name[[state]]

  current <- get_latest_hpi_date(hpi)
  months_elapsed <- calculate_months_elapsed(purchase_year, purchase_month, current$current_year, current$current_month)

  if (!is.na(cbsa) && cbsa != "99999") {
    hpi_match <- hpi[hpi$GEO_Type == "CBSA" & hpi$GEO_Code == cbsa, ]
  } else {
    hpi_match <- hpi[hpi$GEO_Type == "State" & hpi$GEO_Name == state, ]
  }

  if (nrow(hpi_match) == 0) stop("No HPI data found for CBSA or state.")

  index_start <- hpi_match[Year == purchase_year & Month == purchase_month, Index_SA]
  index_now <- hpi_match[Year == current$current_year & Month == current$current_month, Index_SA]

  if (length(index_start) == 0 || length(index_now) == 0) stop("Missing HPI index for given date.")


  current_value <- calculate_current_home_value(purchase_price, index_start, index_now)
  appreciation_percent <- round((index_now / index_start - 1) * 100, 1)
  unpaid <- calculate_unpaid_balance(purchase_price, down_payment, interest_rate, months_elapsed, additional_payments)
  adjusted_current_value = current_value + renovation_value
  ltv <- calculate_ltv_metrics(unpaid, adjusted_current_value, purchase_price)
  message <- determine_eligibility_group(months_elapsed, ltv$eltv, ltv$oltv, equity_boost, delinquency)

  principal_paid = purchase_price - down_payment - unpaid
  equity = adjusted_current_value - unpaid
  home_appreciation = current_value - purchase_price

cancel_dates <- estimate_pmi_cancellation_months(
  purchase_price = purchase_price,
  down_payment = down_payment,
  annual_rate = interest_rate,
  purchase_year = purchase_year,
  purchase_month = purchase_month,
  months_elapsed = months_elapsed,
  additional_payments = additional_payments,
  credit_score_tier = credit_score
  )

list(
  current_home_value = round(current_value, -3),
  adjusted_current_value = round(adjusted_current_value, -3),
  renovation_value = renovation_value,
  additional_payments = additional_payments,
  unpaid_balance = round(unpaid, -3),
  appreciation_percent = appreciation_percent,
  months_elapsed = months_elapsed,
  principal_paid = round(purchase_price - down_payment - unpaid, 0),
  home_appreciation = round(current_value - purchase_price, 0),
  estimated_equity = round(adjusted_current_value - unpaid, -3),
  oltv = ltv$oltv,
  eltv = ltv$eltv,
  equity_percent = round(1 - ltv$eltv, 2) * 100,
  purchase_price = purchase_price,
  down_payment = down_payment,
  adjusted_current_value = adjusted_current_value,
  purchase_year = purchase_year,
  purchase_month = purchase_month,
  current_year = current$current_year,
  current_month = current$current_month,
  cbsa_used = as.character(cbsa_name)[1],
  state_used = as.character(state_name)[1],
  interest_rate = round(interest_rate, 3),
  eligibility_level = message$eligibility_level,
  eligibility_message = message$eligibility_message,
  cancel_request_date = cancel_dates$cancel_request_date,
  auto_cancel_date = cancel_dates$auto_cancel_date,
  estimated_pmi_savings = round(cancel_dates$estimated_pmi_savings, -2)
)
}
