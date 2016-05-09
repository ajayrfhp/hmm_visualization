function sleep(time){
	var stopping_time = new Date().getTime();
	while( new Date().getTime < stop + time ){
		;
	}
}
function animate(this_node,this_text,layers,i,j){

	var previous_color = this_node.attr("fill");
	this_node.attr("fill","black");
	var delay = (i+1) * 1000 + j *500;
	var completed = false;

	setTimeout(function(){
			this_node.attr("fill",previous_color);
			this_text.text(function(d){
				return layers[i].nodes[j].probability.toFixed(3);
			});
			completed = true;
		},delay);
	 
}
function viterbi_compute(data,layers,observed_sequence){
	
	for( i = 0; i < layers.length; i++ ){
					if( i == 0 ){
						probability = 0;
						// Color i th node;
						animate(d3.select("#c_"+i),d3.select("#t_"+i),layers,i,0);
						// put a delay
					}
					else if( i == 1 ){
						for( j = 0; j < layers[i].cnt; j++ ){
							var this_state = layers[i].nodes[j].state;
							layers[i].nodes[j].probability = data.start_probability[this_state] * data.emission_probability[this_state][observed_sequence[i-1]]; 	
							var cnt = 1 + (i-1)*layers[i].cnt + j;
							animate(d3.select("#c_"+cnt),d3.select("#t_"+cnt),layers,i,j);
						}
					}
					else{
						// DP EQUATION OH WOW OH WOW
						var best_probability = 0;
						for( j = 0; j < layers[i].cnt; j++ ){
							best_probability = 0;
							var this_state = layers[i].nodes[j].state;
							for ( k = 0; k < layers[i-1].cnt; k++ ){
								var previous_state = layers[i-1].nodes[k].state;
								var this_probability = data.transition_probability[previous_state][this_state] * layers[i-1].nodes[k].probability * data.emission_probability[this_state][observed_sequence[i-1]];
								if ( best_probability < this_probability ){
									best_probability = this_probability;
								}
							}
							layers[i].nodes[j].probability = best_probability;
							var cnt = 1 + (i-1)*layers[i].cnt + j;
							animate(d3.select("#c_"+cnt),d3.select("#t_"+cnt),layers,i,j);
						}
						best_probability = 0;
						var best_state = null;
						for ( k = 0; k < layers[i-1].cnt; k++ ){
							if( layers[i-1].nodes[k].probability > best_probability  ){
								best_probability = layers[i-1].nodes[k].probability;
								best_state = layers[i-1].nodes[k].state;
							}
						}
						answer.push(best_state);	
					}
				}
				var best_probability = 0;
				var best_state = null;
				// CHOOSE BEST STATE FOR LAST STAGE ALONE
				for ( k = 0; k < layers[layers.length-1].cnt; k++ ){
						if( layers[layers.length-1].nodes[k].probability > best_probability  ){
							best_probability = layers[layers.length-1].nodes[k].probability;
							best_state = layers[layers.length-1].nodes[k].state;
						}
					}
				answer.push(best_state);
	return answer			
}