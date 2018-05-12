'''Tweet Streaming API consumer'''
import twitter, csv, json, sys

# == OAuth Authentication ==
consumer_key = "HUcXih4iRVgoyV13IqxRlS5BU"
consumer_secret = "QUcm0AWx75ajw5Ewqepu4b43pXw1QdswpTrCl9VPcvodIPx2jZ"
access_token = "113197842-c6eW0S1rcaimklsgXTuUoHPHkkXi77cXgxXkgxrQ"
access_token_secret = "Y8xQ4s75Olon1ShCsuGV0SsSG6OgOOjzIGXqQ8BlwrB1r"

auth = twitter.oauth.OAuth(access_token, access_token_secret, consumer_key, consumer_secret)
twitter_api = twitter.Twitter(auth=auth)

csvfile = open('ge14.csv', 'w')
csvwriter = csv.writer(csvfile)

csvwriter.writerow(['created_at',
                    'user-id',
                    'verified',
                    'user-screen_name',
                    'text',
                    'tweet_type',
                    'full_text',
                    'user-created_at',
                    'user-followers_count',
                    'user-friends_count',
                    'user-statuses_count',
                    'user-time_zone',
                    'tweet-place',
                    'user-geo_enabled',
                    'coordinates lng',
                    'coordinates lat',
                    'user-location',
                    'user-language'
                    ])

q = "pru14, ge14"

print 'Filtering the public timeline for keyword="%s"' % (q)
twitter_stream = twitter.TwitterStream(auth=twitter_api.auth)
stream = twitter_stream.statuses.filter(track=q)

''' helper functions, clean data, unpack dictionaries '''
def clean(val):
    clean = ""
    if isinstance(val, bool):
        return val
    if isinstance(val, int):
        return val
    if val:
        val = val.replace('|', ' ')
        val = val.replace('\n', ' ')
        val = val.replace('\r', ' ')
        clean = val.encode('utf-8')
    return clean

def getLng(val):
    if isinstance(val, dict):
        return val['coordinates'][0]

def getLat(val):
    if isinstance(val, dict):
        return val['coordinates'][1]

def getPlace(val):
    if isinstance(val, dict):
        return val['full_name'].encode('utf-8')

# To identify the tweet type
def get_tweet_type(tweet_obj):

    # Set default value as normal
    # Anything that does not fulfill the if-else condition,
    # will get the results as normal
    result = 'normal'

    # if retweeted_status exist in the json object,
    # this tweet is a retweet
    if 'retweeted_status' in tweet_obj:
        result = 'retweet'

    # if quoted_status exist in the json object,
    # this tweet is a quoted_tweet
    elif 'quoted_status' in tweet_obj:
        result = 'quoted_tweet'

    return result

# To get the correct truncated value based on tweet_type
def get_tweet_status(x):
    # tweet_type value is gotten based on the get_tweet_type function
    tweet_type = x['tweet_type']

    # Put a default value in tweet json
    # So that if all does not meet the if-else condition
    # We can check on the particular record
    # As it does not fulfill our requirement
    tweet_status = None

    # if tweet_type is normal,
    # system will only check the outer level of the truncated status
    if tweet_type == 'normal':
        tweet_status = x['truncated']

    # if tweet_type is retweet,
    # system will get the truncated value from retweeted_status
    elif tweet_type == 'retweet':
        tweet_status = x['retweeted_status']['truncated']

    # if tweet_type is quoted_tweet,
    # system will get the truncated value from quoted status
    elif tweet_type == 'quoted_tweet':
        tweet_status = x['quoted_status']['truncated']

    return tweet_status

# To get the correct tweet text, based on twitter type and twitter status
def get_tweet_text(x):

    # Get the value of tweet_type
    # Value : normal, retweet, quoted_tweet
    tweet_type = x['tweet_type']

    # Get the value of tweet_status
    # Value : True, False
    tweet_status = x['tweet_status_truncated']

    # Set tweet_msg as None by default,
    # To check if any message does not fulfill the if else condition
    tweet_msg = None

    # Condition Checking
    #
    # if tweet_type message is normal
    if tweet_type == 'normal':

        # if the tweet_status is True
        # Mean text been truncated
        # hence system should get the full text from extended_tweet
        if tweet_status:
            tweet_msg = x['extended_tweet']['full_text']

        # Else = Truncated status is false
        # System can take back the original text
        else:
            tweet_msg = x['text']

    # if the tweet_typs is retweet
    elif tweet_type == 'retweet':

        # if the tweet_status is True
        # Mean text been truncated
        # System get the full text from retweeted_status -> extended_tweet
        if tweet_status:
            tweet_msg = x['retweeted_status']['extended_tweet']['full_text']

        # Else , full text can be retrieved in retweeted_status
        else:
            tweet_msg = x['retweeted_status']['text']


    # if the tweet_type is quote tweet
    elif tweet_type == 'quoted_tweet':
        # if the tweet status is True
        # retrieve full text from quoted status -> extended_tweet
        if tweet_status:
            tweet_msg = x['quoted_status']['extended_tweet']['full_text']

        # retrieve from quoted_Status
        else:
            tweet_msg = x['quoted_status']['text']

    return tweet_msg

def write_tweet(tweet):
    csvwriter.writerow([tweet['created_at'],
                        tweet['user']['id'],
                        tweet['user']['verified'],
                        clean(tweet['user']['screen_name']),
                        clean(tweet['text']),
                        tweet['tweet_type'],
                        clean(tweet['tweet_text']),
                        tweet['user']['created_at'],
                        tweet['user']['followers_count'],
                        tweet['user']['friends_count'],
                        tweet['user']['statuses_count'],
                        clean(tweet['user']['time_zone']),
                        getPlace(tweet['place']),
                        tweet['user']['geo_enabled'],
                        getLng(tweet['coordinates']),
                        getLat(tweet['coordinates']),
                        clean(tweet['user']['location']),
                        tweet['user']['lang']
                        ])

for tweet in stream:
    # print json.dumps(tweet)
    # sys.exit(1)

    try:
        # Add a key-value pair into tweet json object to identify tweet type
        tweet['tweet_type'] = get_tweet_type(tweet)

        # Check the tweet status whether it has been truncated
        tweet['tweet_status_truncated'] = get_tweet_status(tweet)

        # Check tweet type and tweet status
        # Determine which field to get
        tweet['tweet_text'] = get_tweet_text(tweet)

        # if tweet['tweet_text'] is None:
        #     print tweet

        write_tweet(tweet)

        print tweet['user']['screen_name'], tweet['tweet_type'], clean(tweet['text'])

    except Exception, err:
        print err
        pass

print "done"
