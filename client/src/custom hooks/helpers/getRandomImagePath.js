
export default function getRandomImagePath() {
    const totalImages = 27;
    const randomIndex = Math.floor(Math.random() * totalImages) + 1;
    return `/assets/memes/${randomIndex}.jpeg`;
}