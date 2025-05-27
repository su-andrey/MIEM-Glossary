
export default function getRandomImagePath() {
    const totalImages = 28;
    const randomIndex = Math.floor(Math.random() * totalImages) + 1;
    return `/memes/${randomIndex}.jpeg`;
}