library(readr)
library(dplyr)
library(ggplot2)

ge13 <- read.csv("ge13.csv")
ge14 <- read.csv('ge14.csv')

ge14_bn_malay <- ge14 %>% filter(coallition == "BN" & malay > 50) %>% 
  select(KodPAR, const_name, won_coallition, total_voters, votes_pct, malay)

ge13_bn_malay <- ge13 %>% filter(coallition == "BN" & malay > 50) %>% 
  select(KodPAR, const_name, won_coallition, total_voters, votes_pct, malay)

##############
#malay tsunami
##############

malay_margin <- merge(ge13_bn_malay, ge14_bn_malay, by = "KodPAR") %>%
  mutate(change = ((votes_pct.y - votes_pct.x)/votes_pct.x) * 100) %>%
  arrange(change)

#################################
#ge14 multi-corner fight analysis
#################################

ge14_multi_corner <- ge14 %>% 
  group_by(const_name) %>%
  count(coallition)

ge14_multi_corner <- ge14_multi_corner %>% 
  group_by(const_name) %>%
  summarise(candidate_num = sum(n))

ge14_won_coallition <- ge14 %>% 
  select(const_name, won_coallition)

ge14_won_coallition <- ge14_won_coallition[!duplicated(ge14_won_coallition), ]

ge14_won_coallition <- inner_join(ge14_multi_corner, ge14_won_coallition, by = "const_name")

ge14_multiwayfight_won_coallition <- ge14_won_coallition %>%
  filter(candidate_num >= 3)

ge14_3wayfight_won_coallition <- ge14_won_coallition %>%
  filter(candidate_num == 3)

ge14_4wayfight_won_coallition <- ge14_won_coallition %>%
  filter(candidate_num == 4)

ge14_5wayfight_won_coallition <- ge14_won_coallition %>%
  filter(candidate_num == 5)

ge14_6wayfight_won_coallition <- ge14_won_coallition %>%
  filter(candidate_num == 6)

#################################
#ge13 multi-corner fight analysis
#################################

ge13_multi_corner <- ge13 %>% 
  group_by(const_name) %>%
  count(coallition)

ge13_multi_corner <- ge13_multi_corner %>% 
  group_by(const_name) %>%
  summarise(candidate_num = sum(n))

ge13_won_coallition <- ge13 %>% 
  select(const_name, won_coallition)

ge13_won_coallition <- ge13_won_coallition[!duplicated(ge13_won_coallition), ]

ge13_won_coallition <- inner_join(ge13_multi_corner, ge13_won_coallition, by = "const_name")

ge13_multiwayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num >= 3)

ge13_3wayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num == 3)

ge13_4wayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num == 4)

ge13_5wayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num == 5)

ge13_6wayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num == 6)

ge13_7wayfight_won_coallition <- ge13_won_coallition %>%
  filter(candidate_num == 7)

###########################
#multi-way fight comparison
###########################

summary(ge13_multiwayfight_won_coallition)
summary(ge14_multiwayfight_won_coallition)

summary(ge13_3wayfight_won_coallition)
summary(ge14_3wayfight_won_coallition)

summary(ge13_4wayfight_won_coallition)
summary(ge14_4wayfight_won_coallition)

summary(ge13_5wayfight_won_coallition)
summary(ge14_5wayfight_won_coallition)

summary(ge13_6wayfight_won_coallition)
summary(ge14_6wayfight_won_coallition)

######################
#constituencies margin
######################

const_difference <- ge14 %>%
  select(State, KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win") %>%
  arrange(desc(total_voters))

summary(const_difference)

bn_seats <- ge14 %>%
  select(KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win" & won_coallition == "BN") %>%
  arrange(total_voters)

ph_seats <- ge14 %>%
  select(KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win" & won_coallition == "PH") %>%
  arrange(total_voters)

pas_seats <- ge14 %>%
  select(KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win" & won_coallition == "GS") %>%
  arrange(total_voters)

ind_seats <- ge14 %>%
  select(KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win" & won_coallition == "IND") %>%
  arrange(total_voters)

solidarity_seat <- ge14 %>%
  select(KodPAR, const_name, won_coallition, winlose, total_voters) %>%
  filter(winlose == "win" & won_coallition == "SOLIDARITI") %>%
  arrange(total_voters)

summary(ph_seats)

###########
#export csv
###########

#write.csv(const_difference, "const_difference.csv")

#################
#d3 column chart#
#################
