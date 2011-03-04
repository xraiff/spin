class ApplicationController < ActionController::Base
  rescue_from User::NotAuthorized, :with => :user_not_authorized
  protect_from_forgery

  private

  def authenticate
    authenticate_or_request_with_http_basic do |user_name, password|
      user_name == 'admin' && password == 'password'
    end
  end

  def user_not_authorized
    flash[:error] = "You don't have access to this section."
    redirect_to :back
  end
end
