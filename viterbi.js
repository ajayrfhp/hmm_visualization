function viterbi_compute(data,layers){
	for( i = 0; i < layers.length; i++ ){
					if( i == 0 ){
						probability = 0;
					}
					else if( i == 1 ){
						for( j = 0; j < layers[i].cnt; j++ ){
							var this_state = layers[i].nodes[j].state;
							layers[i].nodes[j].probability = data.start_probability[this_state] * data.emission_probability[this_state][observed_sequence[i-1]]; 	
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