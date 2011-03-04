class CommentsController < ApplicationController
  before_filter :authenticate, :only => :destroy

  def create
    @workout = Workout.find(params[:workout_id])
    @comment = @workout.comments.create(params[:comment])
    redirect_to workout_path(@workout)
  end

  def destroy
    @workout = Workout.find(params[:workout_id])
    @comment = @workout.comments.find(params[:id])
    @comment.destroy
    redirect_to workout_path(@workout)
  end
 
end
