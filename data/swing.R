library(readr)
library(dplyr)
library(ggplot2)

swing <- read.csv('malay_swing.csv')

########################################
#determine all the malay-majority seats#
########################################

ge14_malay_maj <- swing %>%
  filter(ge14_malay > 50) %>%
  select(par_code, state, ge13_constituency, ge14_constituency, ge14_malay, ge13_win_coallition, 
         ge14_win_coallition, adjusted_rede_diff, bn_rede_vote_pct, bn_ge14_vote_pct, swing_pct) %>%
  arrange(swing_pct)

ge13_malay_maj <- swing %>%
  filter(ge13_malay > 50) %>%
  select(par_code, state, ge13_constituency, ge14_constituency, ge14_malay, ge13_win_coallition, 
         ge14_win_coallition, adjusted_rede_diff, bn_rede_vote_pct, bn_ge14_vote_pct, swing_pct) %>%
  arrange(swing_pct)


########################
#determine BN win seats#
########################

ge14_bn_win <- ge14_malay_maj %>% 
  filter(ge14_win_coallition == 'BN')

ge13_bn_win <- ge13_malay_maj %>% 
  filter(ge13_win_coallition == 'BN')


adjusted_diff <- ge14_malay_maj %>% 
  filter(adjusted_rede_diff < 0)
summary(adjusted_diff)

##################################
#determine seats swing against BN#
##################################

bn_swing_lost <- ge14_malay_maj %>%
  filter(swing_pct < 0) %>%
  arrange(swing_pct)

summary(bn_swing_lost)

##################################
#determine seats swing towards BN#
##################################

bn_swing_gain <- ge14_malay_maj %>%
  filter(swing_pct > 0) %>%
  arrange(desc(swing_pct))

summary(bn_swing_gain)

###############################################################
#determine which states that BN suffer from biggest swing lost#
###############################################################

swing_by_state <- bn_swing_lost %>%
  group_by(state)
head(swing_by_state, 10)

swing_groupby_state <- swing_by_state %>%
  count(state)