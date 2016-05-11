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
	return answer;
}

function compute_emission_table(data){
	var states = data.states;
	var row_length = states.length;
	var observations = data.observations;
	var answer = [];
	for( i = 0; i < row_length; i++ ){
		var sub_answer = [];
		sub_answer.push(data.states[i]);
		for( j = 0; j < observations.length; j++ ){
			sub_answer.push(data.emission_probability[states[i]][observations[j]]);
		}
		answer.push(sub_answer);
	}
	return answer;
}
function compute_prior_table(data){
	var answer = ["Probability"];
	answer.push(data.start_probability);
	return answer;
}