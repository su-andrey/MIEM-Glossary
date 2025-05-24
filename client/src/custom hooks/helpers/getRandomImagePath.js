
export default function getRandomImagePath() {
    const totalImages = 18;
    const randomIndex = Math.floor(Math.random() * totalImages) + 1;
    return `/memes/${randomIndex}.jpeg`;
}