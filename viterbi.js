
function animate_bigger(i,j,layers){
	
	var delay = (i+2) * 2000 + j *1000;
	var cnt = 1 + (i-1) * layers[1].cnt  + j;
	d3.select("#c_" + cnt).transition().delay(delay).attr("r",75);
}
function animate_edge(i,j,k){
	// ANIMATE THE EDGE BETWEEN i-1,k and i,j
	
	var edge_src = layers[i-1].nodes[k];
	var edge_dest = layers[i].nodes[j];
	var cnt = 1 + (i-1) * layers[1].cnt  + j;
	var delay = (i+1) * 2000 + j *1000;
	var this_id = "#e_"+ (i-1).toString() + (k).toString() + (i).toString() + (j).toString() ; 
	var edge = document.getElementById(this_id);
	d3.select(edge).transition().delay(delay).attr("style","stroke: rgb(62, 167, 138);stroke-width:5");
	setTimeout(function(){
			d3.select(edge).attr("style","stroke: rgb(62, 167, 138);stroke-width:2");
		},delay+500);
}
function animate(this_node,this_text,layers,i,j,data){
	var previous_color = this_node.attr("fill");
	this_node.attr("fill","0D0E04");
	var delay = (i+1) * 2000 + j *1000;
	console.log(i,j,delay);
	var completed = false;
	var this_state = layers[i].nodes[j].state;

	// HIGHLIGHT THIS STATE IN THE TABLE

	var row_number = null;
	if( i!=0 )
		{
			row_number = data.states.indexOf(this_state) + 2;
			d3.select("tr:nth-child(" + row_number + ")" ).transition().delay(delay).attr("style","background-color:black;color:white");
		}


	setTimeout(function(){
			this_text.text(function(d){
				return layers[i].nodes[j].probability.toFixed(3);
			});		
			this_node.attr("fill",previous_color);
		
			if( i!=0 ){
				d3.select("tr:nth-child(" + row_number + ")" ).attr("style","background-color:white;color:black");
			}	

			completed = true;
		},delay);
	 
}
function viterbi_compute(data,layers,observed_sequence){
	for( i = 0; i < layers.length; i++ ){
					if( i == 0 ){
						probability = 0;
						// Color i th node;
						animate(d3.select("#c_"+i),d3.select("#t_"+i),layers,i,0,data);

						// put a delay
					}
					else if( i == 1 ){
						for( j = 0; j < layers[i].cnt; j++ ){
							var this_state = layers[i].nodes[j].state;
							layers[i].nodes[j].probability = data.start_probability[this_state] * data.emission_probability[this_state][observed_sequence[i-1]]; 	
							var cnt = 1 + (i-1)*layers[i].cnt + j;
							animate(d3.select("#c_"+cnt),d3.select("#t_"+cnt),layers,i,j,data);
							
							animate_edge(i,j,0);

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
								animate_edge(i,j,k);
								if ( best_probability < this_probability ){
									best_probability = this_probability;
								}
							}
							layers[i].nodes[j].probability = best_probability;
							var cnt = 1 + (i-1)*layers[i].cnt + j;
							animate(d3.select("#c_"+cnt),d3.select("#t_"+cnt),layers,i,j,data);
						}
						best_probability = 0;
						var temp_i, temp_j;
						var best_state = null;
						for ( k = 0; k < layers[i-1].cnt; k++ ){
							if( layers[i-1].nodes[k].probability > best_probability  ){
								best_probability = layers[i-1].nodes[k].probability;
								best_state = layers[i-1].nodes[k].state;
								temp_i = i-1;
								temp_j = k;
							}
						}
						answer.push(best_state);
						animate_bigger(temp_i,temp_j,layers);	

					}
				}
				var best_probability = 0;
				var best_state = null;
				var best_k;
				// CHOOSE BEST STATE FOR LAST STAGE ALONE
				for ( k = 0; k < layers[layers.length-1].cnt; k++ ){
						if( layers[layers.length-1].nodes[k].probability > best_probability  ){
							best_probability = layers[layers.length-1].nodes[k].probability;
							best_state = layers[layers.length-1].nodes[k].state;
							best_k = k;
						}
					}
				animate_bigger(layers.length-1,best_k,layers);

				answer.push(best_state);
	return answer			
}

function viterbi_compute_reverse(data,layers,observed_sequence,current_layer){

	// HIGHLIGHT INCOMING EDGES FROM PREVIOUS LAYER, CHANGE COLOR OF THIS NODE, INSIDE SITEMOUT GIVE RECURSION CALL FOR NEXT LAYER
	if( current_layer == 0){
		// NO INCOMING EDGES FROM PREVIOUS LAYER
		

	}
	else if( current_layer == layers.length-1 ){

	}
	else{

	}
}