var state = 0;//seed();

export default function lcg() {
    state = (5 * state + 3) % 16;
    return state;
}
