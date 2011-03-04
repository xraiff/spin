module WorkoutsHelper
  def join_tags(workout)
    workout.tags.map { |t| t.name }.join(", ")
  end
end
