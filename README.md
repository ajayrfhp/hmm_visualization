# hmm_visualization
* GOAL
	* Given a sequence of observable states, transmission probability and emission probability, the most probable sequence of hidden states is determined.

* Transmission Probability
	* Probability of a state change occuring from one state to another.

* Emission Probability
	* Probability of observance of an observable state given hidden state.

RECURRENCE EQUATION
> P[i,j] = max( P[ i-1 , k ] * TR_P[ k , j ] * EM_P[ current_state , obs_seq[i] ]  )

BEST STATE FINDER

> Answer[i] = { j , S.T max( P[ i - i, k ]) = P[ i-1 ,j ] for all k }