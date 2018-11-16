require "sinatra"
require 'stripe'
require 'money'

set :publishable_key, "pk_test_lGM6SReQSvPjCdivpDQILn9e" #ENV['PUBLISHABLE_KEY']
set :secret_key, "sk_test_FiCwbEb2gsfvzW2m9jILBqpF" #ENV['SECRET_KEY']

get "/" do
	"hello"
end