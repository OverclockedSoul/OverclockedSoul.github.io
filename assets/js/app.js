document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid")
    const scoreDisplay = document.querySelector("#score")
    const resultDisplay = document.querySelector("#result")
    const width = 4
    let squares = []
    let score = 0

    // create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div")
            square.innerHTML = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    // generate a new number using a minimax algorithm with depth 4
    function generate() {
        // Find all empty squares
        let emptySquares = []
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                emptySquares.push(i)
            }
        }

        if (emptySquares.length === 0) return

        // Initialize variables to keep track of the best move (worst for the player)
        let bestScore = Infinity
        let bestMove = null

        // For each empty square and possible tile (2 or 4)
        for (let index of emptySquares) {
            for (let tileValue of [2, 4]) {
                // Clone the game state
                let newSquares = squares.map(square => parseInt(square.innerHTML))
                newSquares[index] = tileValue

                // Evaluate the board using minimax
                let score = minimax(newSquares, 0, true, -Infinity, Infinity)

                // If this move is worst for the player (lower score), update bestMove
                if (score < bestScore) {
                    bestScore = score
                    bestMove = { index: index, value: tileValue }
                }
            }
        }

        // Place the tile at the best move
        if (bestMove) {
            squares[bestMove.index].innerHTML = bestMove.value
        } else {
            // If no best move found, place a 2 randomly
            const randomNumber = Math.floor(Math.random() * emptySquares.length)
            squares[emptySquares[randomNumber]].innerHTML = 2
        }

        checkForGameOver()
    }

    function minimax(board, depth, isPlayerTurn, alpha, beta) {
        if (depth === 4 || isGameOver(board)) {
            return evaluateBoard(board)
        }

        if (isPlayerTurn) {
            let maxEval = -Infinity
            let moves = getAvailableMoves(board)
            for (let move of moves) {
                let newBoard = executeMove(board, move)
                let eval = minimax(newBoard, depth + 1, false, alpha, beta)
                maxEval = Math.max(maxEval, eval)
                alpha = Math.max(alpha, eval)
                if (beta <= alpha) break
            }
            return maxEval
        } else {
            let minEval = Infinity
            let emptySquares = []
            for (let i = 0; i < board.length; i++) {
                if (board[i] === 0) {
                    emptySquares.push(i)
                }
            }
            for (let index of emptySquares) {
                for (let tileValue of [2, 4]) {
                    let newBoard = board.slice()
                    newBoard[index] = tileValue
                    let eval = minimax(newBoard, depth + 1, true, alpha, beta)
                    minEval = Math.min(minEval, eval)
                    beta = Math.min(beta, eval)
                    if (beta <= alpha) break
                }
            }
            return minEval
        }
    }

    function getAvailableMoves(board) {
        let moves = []
        if (canMoveLeft(board)) moves.push('left')
        if (canMoveRight(board)) moves.push('right')
        if (canMoveUp(board)) moves.push('up')
        if (canMoveDown(board)) moves.push('down')
        return moves
    }

    function executeMove(board, direction) {
        let newBoard = board.slice()
        switch (direction) {
            case 'left':
                newBoard = moveLeftBoard(newBoard)
                break
            case 'right':
                newBoard = moveRightBoard(newBoard)
                break
            case 'up':
                newBoard = moveUpBoard(newBoard)
                break
            case 'down':
                newBoard = moveDownBoard(newBoard)
                break
        }
        return newBoard
    }

    function evaluateBoard(board) {
        // Simple heuristic: count the number of empty squares
        let emptySquares = board.filter(value => value === 0).length
        // Invert the value to ensure lower scores are worse for the player
        return emptySquares
    }

    function isGameOver(board) {
        if (board.includes(0)) return false
        if (canMoveLeft(board)) return false
        if (canMoveRight(board)) return false
        if (canMoveUp(board)) return false
        if (canMoveDown(board)) return false
        return true
    }

    function canMoveLeft(board) {
        for (let i = 0; i < 16; i++) {
            if (i % 4 !== 0) {
                if (board[i] !== 0) {
                    if (board[i - 1] === 0 || board[i - 1] === board[i]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    function canMoveRight(board) {
        for (let i = 0; i < 16; i++) {
            if (i % 4 !== 3) {
                if (board[i] !== 0) {
                    if (board[i + 1] === 0 || board[i + 1] === board[i]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    function canMoveUp(board) {
        for (let i = 4; i < 16; i++) {
            if (board[i] !== 0) {
                if (board[i - width] === 0 || board[i - width] === board[i]) {
                    return true
                }
            }
        }
        return false
    }

    function canMoveDown(board) {
        for (let i = 0; i < 12; i++) {
            if (board[i] !== 0) {
                if (board[i + width] === 0 || board[i + width] === board[i]) {
                    return true
                }
            }
        }
        return false
    }

    function moveLeftBoard(board) {
        let newBoard = board.slice()
        for (let i = 0; i < 16; i += 4) {
            let row = newBoard.slice(i, i + 4)
            let filteredRow = row.filter(num => num)
            let missing = 4 - filteredRow.length
            let zeros = Array(missing).fill(0)
            let newRow = filteredRow.concat(zeros)
            for (let j = 0; j < 4; j++) {
                newBoard[i + j] = newRow[j]
            }
            // Combine tiles
            for (let j = 0; j < 3; j++) {
                if (newBoard[i + j] !== 0 && newBoard[i + j] === newBoard[i + j + 1]) {
                    newBoard[i + j] *= 2
                    newBoard[i + j + 1] = 0
                }
            }
            // Shift again after combining
            row = newBoard.slice(i, i + 4)
            filteredRow = row.filter(num => num)
            missing = 4 - filteredRow.length
            zeros = Array(missing).fill(0)
            newRow = filteredRow.concat(zeros)
            for (let j = 0; j < 4; j++) {
                newBoard[i + j] = newRow[j]
            }
        }
        return newBoard
    }

    function moveRightBoard(board) {
        let newBoard = board.slice()
        for (let i = 0; i < 16; i += 4) {
            let row = newBoard.slice(i, i + 4)
            let filteredRow = row.filter(num => num)
            let missing = 4 - filteredRow.length
            let zeros = Array(missing).fill(0)
            let newRow = zeros.concat(filteredRow)
            for (let j = 0; j < 4; j++) {
                newBoard[i + j] = newRow[j]
            }
            // Combine tiles
            for (let j = 3; j > 0; j--) {
                if (newBoard[i + j] !== 0 && newBoard[i + j] === newBoard[i + j - 1]) {
                    newBoard[i + j] *= 2
                    newBoard[i + j - 1] = 0
                }
            }
            // Shift again after combining
            row = newBoard.slice(i, i + 4)
            filteredRow = row.filter(num => num)
            missing = 4 - filteredRow.length
            zeros = Array(missing).fill(0)
            newRow = zeros.concat(filteredRow)
            for (let j = 0; j < 4; j++) {
                newBoard[i + j] = newRow[j]
            }
        }
        return newBoard
    }

    function moveUpBoard(board) {
        let newBoard = board.slice()
        for (let i = 0; i < 4; i++) {
            let column = [newBoard[i], newBoard[i + width], newBoard[i + width * 2], newBoard[i + width * 3]]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)
            for (let j = 0; j < 4; j++) {
                newBoard[i + width * j] = newColumn[j]
            }
            // Combine tiles
            for (let j = 0; j < 3; j++) {
                if (newBoard[i + width * j] !== 0 && newBoard[i + width * j] === newBoard[i + width * (j + 1)]) {
                    newBoard[i + width * j] *= 2
                    newBoard[i + width * (j + 1)] = 0
                }
            }
            // Shift again after combining
            column = [newBoard[i], newBoard[i + width], newBoard[i + width * 2], newBoard[i + width * 3]]
            filteredColumn = column.filter(num => num)
            missing = 4 - filteredColumn.length
            zeros = Array(missing).fill(0)
            newColumn = filteredColumn.concat(zeros)
            for (let j = 0; j < 4; j++) {
                newBoard[i + width * j] = newColumn[j]
            }
        }
        return newBoard
    }

    function moveDownBoard(board) {
        let newBoard = board.slice()
        for (let i = 0; i < 4; i++) {
            let column = [newBoard[i], newBoard[i + width], newBoard[i + width * 2], newBoard[i + width * 3]]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)
            for (let j = 0; j < 4; j++) {
                newBoard[i + width * j] = newColumn[j]
            }
            // Combine tiles
            for (let j = 3; j > 0; j--) {
                if (newBoard[i + width * j] !== 0 && newBoard[i + width * j] === newBoard[i + width * (j - 1)]) {
                    newBoard[i + width * j] *= 2
                    newBoard[i + width * (j - 1)] = 0
                }
            }
            // Shift again after combining
            column = [newBoard[i], newBoard[i + width], newBoard[i + width * 2], newBoard[i + width * 3]]
            filteredColumn = column.filter(num => num)
            missing = 4 - filteredColumn.length
            zeros = Array(missing).fill(0)
            newColumn = zeros.concat(filteredColumn)
            for (let j = 0; j < 4; j++) {
                newBoard[i + width * j] = newColumn[j]
            }
        }
        return newBoard
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    ///assign functions to keys
    function control(e) {
        if (e.key === "ArrowLeft" || e.key == "a") {
            keyLeft()
        } else if (e.key === "ArrowRight" || e.key == "d") {
            keyRight()
        } else if (e.key === "ArrowUp" || e.key == "w") {
            keyUp()
        } else if (e.key === "ArrowDown" || e.key == "s") {
            keyDown()
        }
    }
    document.addEventListener("keydown", control)

    // Handle touch events
    let startX, startY, endX, endY

    function handleTouchStart(e) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
    }

    function handleTouchEnd(e) {
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY

        let deltaX = endX - startX
        let deltaY = endY - startY

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 30) {
                // Swipe Right
                keyRight()
            } else if (deltaX < -30) {
                // Swipe Left
                keyLeft()
            }
        } else {
            if (deltaY > 30) {
                // Swipe Down
                keyDown()
            } else if (deltaY < -30) {
                // Swipe Up
                keyUp()
            }
        }
    }
    document.addEventListener('touchstart', handleTouchStart, false)
    document.addEventListener('touchend', handleTouchEnd, false)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    //check for the number 2048 in the squares to win
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = "You WIN!"
                document.removeEventListener("keydown", control)
                document.removeEventListener('touchstart', handleTouchStart, false)
                document.removeEventListener('touchend', handleTouchEnd, false)
                setTimeout(clear, 3000)
            }
        }
    }

    //check if there are no zeros and no possible moves to lose
    function checkForGameOver() {
        let zeros = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++
            }
        }
        const currentBoard = squares.map(square => parseInt(square.innerHTML))
        if (zeros === 0) {
            // Also check if there are no possible moves
            if (!canMoveLeft(currentBoard) &&
                !canMoveRight(currentBoard) &&
                !canMoveUp(currentBoard) &&
                !canMoveDown(currentBoard)) {
                resultDisplay.innerHTML = "You LOSE!"
                document.removeEventListener("keydown", control)
                document.removeEventListener('touchstart', handleTouchStart, false)
                document.removeEventListener('touchend', handleTouchEnd, false)
                setTimeout(clear, 3000)
            }
        }
    }

    function clear() {
        clearInterval(myTimer)
    }

    //add colours
    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = "#afa192"
            else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = "#eee4da"
            else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = "#ede0c8"
            else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = "#f2b179"
            else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = "#ffcea4"
            else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = "#e8c064"
            else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = "#ffab6e"
            else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = "#fd9982"
            else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = "#ead79c"
            else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = "#76daff"
            else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = "#beeaa5"
            else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = "#d7d4f0"
        }
    }
    addColours()

    let myTimer = setInterval(addColours, 50)
})