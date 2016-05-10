function compute_transmission_table(data){
	var row_length = data.states.length;
	var answer = [];
	for( i = 0; i < row_length; i++){
		var sub_answer = [];
		sub_answer.push(data.states[i]);
		for( j = 0; j < row_length; j++){
			sub_answer.push(data.transition_probability[data.states[i]][data.states[j]])
		}
		answer.push(sub_answer);
	}
	console.log(answer);
	return answer;

}