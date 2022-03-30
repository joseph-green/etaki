class Etaki {
    constructor(answer, level) {
        this.answer = answer
        this.fragments = createFragments(answer, level)

        console.log(this.fragments)

    }

    guess(params) {
        
    }
}

class Level {
    constructor(max_layers, max_length, lambda) {
        this.max_layers = max_layers
        this.layers_lambda = lambda
        this.max_length = max_length
    }
}

hardMode = new Level(2,3,1)

sampleExp = function(lambda) {
    p = Math.random()
    return -Math.log(1-p)/lambda
}

shuffle = function(arr) {
    i = arr.length - 1
    shuffle_arr = arr
    while (i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        arr_j = shuffle_arr[j]
        arr_i = shuffle_arr[i]
        shuffle_arr[i] = arr_j
        shuffle_arr[j] = arr_i
        i--;
    }
    return shuffle_arr

}

class Fragment {
    constructor(fragment) {
        this.fragment = fragment
        this.position = -1
    }
}


createFragments = function(answer, level) {
    // the number of fragments overlaying a single position is given by a Exp(s * max_layers), where s is a constant <= 1
    // length of each fragment given by Exp(l * max_length), where l is a constant (should be >= 1)
    fragments = []
    open_fragments = []
    for (i = 0; i < answer.length; i++) {
        // see how many layers we should have at i
        fragments_i = Math.floor(sampleExp(1))

        if (fragments_i < 1) {
            fragments_i = 1
        }
        else if (fragments_i > level.max_layers) {
            fragments_i = level.max_layers
        }
        

        if (open_fragments.length > fragments_i) {
            for (j = 0; j < (open_fragments.length - fragments_i); j++) {
                fragment = open_fragments.shift()
                fragments.push(fragment)
            }
        }
        else if (open_fragments.length < fragments_i) {
            for (j = 0; j < (fragments_i - open_fragments.length); j++) {
                open_fragments.push(new Fragment(""))
            }
        }
        else {
            for (j = 0; j < open_fragments.length; j++) {
                if (open_fragments[j].fragment.length >= level.max_length) {
                    fragment = open_fragments.shift()
                    fragments.push(fragment)
                    open_fragments.push(new Fragment(""))
                }
            }
        }

        for (j = 0; j < open_fragments.length; j++) {
            open_fragments[j].fragment += answer[i]
        }

    }

    fragments.push(...open_fragments)
    return shuffle(fragments)
}
