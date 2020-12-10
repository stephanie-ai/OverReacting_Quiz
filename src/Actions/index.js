export function getQuestions (amount, category, difficulty) {
    return async dispatch => {
        try {
            const questions = await fetchQuestions(amount, category, difficulty);
            dispatch(loadQuestions(questions));
        } catch (err) {
            dispatch(handleError(err));
        };
    };
};

async function fetchQuestions (amount, category, difficulty) {
    try {
        const resp = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&encode=base64`);
        const data = await resp.json();
        const questions = data.results.map(
            function decodeData (question) {
                const actualType = atob(question.type);
                const actualCategory = atob(question.category);
                const actualQuestion = atob(question.question);
                const actualCorrect_answer = atob(question.correct_answer);
                const actualIncorrect_answers = question.incorrect_answers.map(falseAnswer => atob(falseAnswer));
                return {
                    type:actualType,
                    category: actualCategory,
                    question: actualQuestion,
                    correct_answer: actualCorrect_answer,
                    incorrect_answers: actualIncorrect_answers
                };
            }
        );
        return questions;
    } catch(err) {
        throw new Error(err.message);
    };
};


export const setPlayers = (playerNumber, playerStats) => ({ type: 'LOAD_PLAYERS', totalPlayers: playerNumber, players: playerStats});
export const loadQuestions = (questions) => ({ type: 'LOAD_QUESTIONS', payload: questions });
export const nextQuestion = () => ({type: 'NEXT_QUESTION'});
export const increasePlayerScore = (player) => ({type: 'INCREASE_PLAYER_SCORE', payload: player })


export const handleError = err => {
    console.warn(err);
    return {type: 'SET_ERROR', payload: err.message}
}

let nextPlayerId = 0;

export const addPlayer = name => {
    return {
        type: actionTypes.ADD_PLAYER,
        id: nextPlayerId++,
        name
    }
}

// export default updatePlayersName = e => ({
//     type: 'UPDATE_PLAYERS_NAMES',
//     payload: { name: e.target.name }
// });



// export const loadPlayer = (players) => ({ type: 'LOAD_PLAYER', payload: {players} })
// export const reload = () => ({type: 'RESET_GAME'})