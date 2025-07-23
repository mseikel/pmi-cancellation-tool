library(plumber)

# Load and run the API
pr("pmi-api/plumber.R") %>% 
  pr_run(port = 8000)

