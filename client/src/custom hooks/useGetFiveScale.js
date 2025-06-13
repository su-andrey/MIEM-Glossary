const useGetFiveScale = (data, signs = 0) => {
    const likes = data.likes ?? 0;
    const dislikes = data.dislikes ?? 0;
    const total = likes + dislikes;
    if (total === 0) return "0.0";
    const rawScore = 5 * (likes / total);
    const fixed = rawScore.toFixed(signs);
    if (fixed.includes('.') && /^0+$/.test(fixed.split('.')[1])) {
        return fixed;
    }
    return Number(fixed);
}

export default useGetFiveScale;