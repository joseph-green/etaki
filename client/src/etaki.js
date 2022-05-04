class Etaki {
    constructor(puzzle_number, answer, level) {
        this.puzzle_number = puzzle_number
        this.complete = false
        this.answer = answer
        this.fragments = createFragments(answer, level)


    }

    fragmentFitsOnBoard(fragment, i) {

        if (this.answer.length < fragment.fragment.length + i || i < 0) {
            return false
        }
        
        for (const frag of this.fragments) {
            if (frag === fragment) {
                continue
            }
            else if (frag.position < 0 || frag.position + frag.fragment.length < i || i + fragment.length < frag.position) {
                continue
            }
            else {
                for (let j = 0; j < fragment.fragment.length; j++) {
                    if (j + (i - frag.position) < 0 || j + (i - frag.position) >= frag.fragment.length) {
                        continue
                    }
                    else if (frag.fragment[j + (i - frag.position)] !== fragment.fragment[j]) {
                        return false
                    }
                }
            }
        }
        return true
    }

    addFragmentToBoard(fragment, i) {
        if (!this.fragments.includes(fragment)) {
            throw new Error("fragment does not exist")
        }
        else if (!this.fragmentFitsOnBoard(fragment,i)) {
            return false
        }

        fragment.position = i

        if (this.isWin()) {
            this.complete = true
        }
        return true

    }

    removeFragmentFromBoard(fragment) {
        if (!this.fragments.includes(fragment)) {
            throw new Error("fragment does not exist")
        }

        fragment.position = -1
        return true

    }

    isWin() {

        // all fragments are placed on board
        for (let i = 0; i < this.fragments.length; i++) {
            if (this.fragments[i].position < 0) {
                return false
            }
        }

        // the boards result is the same as the answer
        if (this.renderBoard().map((slot) => slot.letter).join("") !== this.answer) {
            return false
        }

        return true
    }

    clearBoard() {
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].position = -1
        }
    }

    renderBoard() {
        let board = Array(this.answer.length).fill(null)
        for (let i = 0; i < board.length; i++) {
            board[i] = {
                letter: null,
                weight: 0
            }
        }
        for (const fragment of this.fragments) {
            if (fragment.position < 0) {
                continue;
            }
            for (let i = 0; i < fragment.fragment.length; i++) {
                if (board[fragment.position + i].letter == null) {
                    board[fragment.position + i].letter = fragment.fragment[i]
                }
                board[fragment.position + i].weight++
            }

        }
        return board
    }
}

class Level {
    constructor(max_layers, max_length, lambda) {
        this.max_layers = max_layers
        this.layers_lambda = lambda
        this.max_length = max_length
    }
}

let hardMode = new Level(2,3,1)

let sampleExp = function(lambda) {
    let p = Math.random()
    return -Math.log(1-p)/lambda
}

let shuffle = function(arr) {
    let i = arr.length - 1
    let shuffle_arr = arr
    while (i > 0) {
        let j = Math.floor(Math.random() * (i + 1));
        let arr_j = shuffle_arr[j]
        let arr_i = shuffle_arr[i]
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


function createFragments(answer, level) {
    // the number of fragments overlaying a single position is given by a Exp(s * max_layers), where s is a constant <= 1
    // length of each fragment given by Exp(l * max_length), where l is a constant (should be >= 1)
    let fragments = []
    let open_fragments = []
    for (let i = 0; i < answer.length; i++) {
        // see how many layers we should have at i
        let fragments_i = Math.floor(sampleExp(1))

        if (fragments_i < 1) {
            fragments_i = 1
        }
        else if (fragments_i > level.max_layers) {
            fragments_i = level.max_layers
        }
        

        if (open_fragments.length > fragments_i) {
            for (let j = 0; j < (open_fragments.length - fragments_i); j++) {
                let fragment = open_fragments.shift()
                fragments.push(fragment)
            }
        }
        else if (open_fragments.length < fragments_i) {
            for (let j = 0; j < (fragments_i - open_fragments.length); j++) {
                open_fragments.push(new Fragment(""))
            }
        }
        else {
            for (let j = 0; j < open_fragments.length; j++) {
                if (open_fragments[j].fragment.length >= level.max_length) {
                    let fragment = open_fragments.shift()
                    fragments.push(fragment)
                    open_fragments.push(new Fragment(""))
                }
            }
        }

        for (let j = 0; j < open_fragments.length; j++) {
            open_fragments[j].fragment += answer[i]
        }

    }

    fragments.push(...open_fragments)
    return shuffle(fragments)
}

export {Etaki, hardMode}