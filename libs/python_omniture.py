import os
import omniture

analytics = omniture.authenticate('atalayk:NHLBI','bc79e84eba094e9b8d6d642cb9d47a41')
suite = analytics.suites['nhlbiapps']
report = suite.report \
	.element('page') \
	.metric('pageviews') \
	.range('2017-05-01', '2017-05-02', granularity='day') \
	.run()
print(report)