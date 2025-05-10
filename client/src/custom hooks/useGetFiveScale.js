const getFiveScale = (data, signs = 0) => {
    const { likes, dislikes } = data;
    const total = likes + dislikes;
    if (total === 0) return "0.0";
    const rawScore = 5 * (likes / total);
    if(rawScore.toFixed(signs)[2]==='0'){
        return rawScore.toFixed(signs)
    }
    else{
        return Number(rawScore.toFixed(signs))
    }
}

export default getFiveScale;