function animate_edge(i,j,k){
	// ANIMATE THE EDGE BETWEEN i-1,k and i,j
	
	var edge_src = layers[i-1].nodes[k];
	var edge_dest = layers[i].nodes[j];
	var cnt = 1 + (i-1) * layers[1].cnt  + j;
	var delay = (j+1) * 1000;
	var this_id = "#e_"+ (i-1).toString() + (k).toString() + (i).toString() + (j).toString() ; 
	var edge = document.getElementById(this_id);
	d3.select(edge).transition().delay(delay).attr("style","stroke: rgb(62, 167, 138);stroke-width:7");
	var row_number = null;
	var column_number = null;
	var this_state = edge_src.state;
	var previous_state = edge_src.state;
	setTimeout(function(){
			d3.select(edge).attr("style","stroke: rgb(62, 167, 138);stroke-width:2");
		},delay+500);
}

function animate_bigger(i,j,data,layers,observed_sequence,current_layer){
		var delay = j * 500;
		var cnt = 1 + (i-1) * layers[1].cnt  + j;
		d3.select("#c_" + cnt).transition().delay(delay).attr("r",75);
}


function animate_node(i,j,data,layers,observed_sequence,current_layer){
	var node = layers[i].nodes[j];
	var circle = d3.select("#c_" + node.id);
	var text = d3.select("#t_" + node.id);
	var previous_color = circle.attr("fill");
	circle.attr("fill","#0D0E04");
	var delay = (j+1) * 1000;


	// animate appropriate observed sequence
	var ind = current_layer + 1;
	var state = node.state;
	
	var row_number = null;
	var column_number = null;
	var current_obs = observed_sequence[current_layer];
	if( i!=0 ){
			row_number = data.states.indexOf(state) + 2;
			column_number = current_layer + 1;
			d3.select("#table_1").select("tr:nth-child(" + row_number + ")" ).transition().delay(delay).attr("style","background-color:black;color:white");
		}

	if( i != 0 ){
		d3.select(".obs").select("div:nth-child(" + ind + ")" ).transition().delay(delay).attr("style","background-color:black;color:white");
		d3.select("#table_2").select("tr:nth-child(" + row_number + ")" ).select("td:nth-child(" + column_number + ")" ).transition().delay(delay).attr("style","background-color:black;color:white");
	}


	// animate appropriate row in table as well
		
	setTimeout(function(){
		circle.attr("fill",previous_color);
		text.text(function(d){
				return layers[i].nodes[j].probability.toFixed(3);
		});
		if(row_number != null){
				d3.select("#table_1").select("tr:nth-child(" + row_number + ")" ).attr("style","background-color:white;color:black");
			}
		if( i != 0 ){
			d3.select(".obs").select("div:nth-child(" + ind + ")" ).attr("style","background-color:white;color:black");
			d3.select("#table_2").select("tr:nth-child(" + row_number + ")" ).select("td:nth-child(" + column_number + ")" ).transition().delay(delay-1000).attr("style","background-color:white;color:black");			
		}
		
	},delay + 500);
}


function viterbi_compute_reverse(data,layers,observed_sequence,current_layer){

	// HIGHLIGHT INCOMING EDGES FROM PREVIOUS LAYER, CHANGE COLOR OF THIS NODE, INSIDE SITEMOUT GIVE RECURSION CALL FOR NEXT LAYER
	if( current_layer == 0){
		// NO INCOMING EDGES FROM PREVIOUS LAYER
		probability = 1;
		layers[current_layer].nodes[0].probability = probability;
		animate_node(current_layer,0,data,layers,observed_sequence,current_layer);
		setTimeout(function(){	
			viterbi_compute_reverse(data,layers,observed_sequence,current_layer+1);		
		},2000);
	}
	else{
		for( j = 0; j < layers[current_layer].cnt; j++ ){
			// for each node in this layer
			var this_node = layers[current_layer].nodes[j];
			// scan values from nodes of previous layer
			var best_probability = 0;



			for( k = 0; k < layers[current_layer-1].cnt; k++ ){
				var previous_node = layers[current_layer-1].nodes[k];
				// animate_edge between ( i-1,k and i,j )
				animate_edge(current_layer,j,k,data,layers,observed_sequence,current_layer);
				var transition_probability = 0;
				if( previous_node.state == "" ){
					transition_probability = data.start_probability[this_node.state];
				}
				else{
					transition_probability = data.transition_probability[previous_node.state][this_node.state];
				}
				var this_probability = transition_probability * previous_node.probability * data.emission_probability[this_node.state][observed_sequence[current_layer-1]];
				if( this_probability > best_probability ){
					best_probability = this_probability;
				}
			}
			this_node.probability = best_probability;
			animate_node(current_layer,j,data,layers,observed_sequence,current_layer);
		}
		var best_probability = 0;
		var best_state = 0;
		var best_j = null;
		if(current_layer > 1){
			for( j = 0; j < layers[current_layer-1].cnt; j++ ){
				if( layers[current_layer-1].nodes[j].probability > best_probability ){
					best_probability = layers[current_layer-1].nodes[j].probability;
					best_state = layers[current_layer-1].nodes[j].state;
					best_j = j;
				}
			}
			// animate bigger
			animate_bigger(current_layer-1,best_j,data,layers,observed_sequence,current_layer);
			d3.select(".ans").select("div:nth-child(" + current_layer + " )")[0][0].innerHTML = best_state;
			answer.push(best_state);			
		}
		if( current_layer+1 < layers.length ){
			setTimeout(function(){	
				viterbi_compute_reverse(data,layers,observed_sequence,current_layer+1);		
			},3000);
		}

		else{
			setTimeout(function(){		
				var best_probability = 0;
				var best_state = 0;
				var best_j = null;
					for( j = 0; j < layers[current_layer].cnt; j++ ){
						if( layers[current_layer].nodes[j].probability > best_probability ){
							best_probability = layers[current_layer].nodes[j].probability;
							best_state = layers[current_layer].nodes[j].state;
							best_j = j;
					}
				}
				// animate bigger
				animate_bigger(current_layer,best_j,data,layers,observed_sequence,current_layer);
				var last_variable = current_layer + 1;
				d3.select(".ans").select("div:nth-child(" + last_variable  + " )")[0][0].innerHTML = best_state;
				answer.push(best_state);					
				},3000);
		}
	}
}