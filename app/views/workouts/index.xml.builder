xml.data {
  xml.workouts {
    #for workout in @workouts
    @workouts.each do |workout| 
      xml.comment!("here is a comment")
      xml.workout(:id => workout.id) {
        xml.name workout.name
        xml.description workout.description
  #      xml.comments do
  #        workout.comments.each do |comment|
  #          xml.comment do
  #            xml.commenter comment.commenter
  #            xml.body comment.body
  #          end
  #        end
        xml.cdata!("here is some cdata")
      }
    end
  }
  xml.comments {
    @workouts.each do |workout|
       workout.comments.each do |comment|
        xml.comment(:id => comment.id, :workout_id => workout.id) {
          xml.commenter comment.commenter
          xml.body comment.body
        }
      end
    end
  }
}
