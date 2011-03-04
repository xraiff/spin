xml.workout(:id => @workout.id) {
	xml.name @workout.name
	xml.description @workout.description
	xml.comments {
		@workout.comments.each do |comment|
			xml.comment {
				xml.commenter comment.commenter
				xml.body comment.body
			}
		end
		xml.cdata!("here is some cdata")
	}
}
