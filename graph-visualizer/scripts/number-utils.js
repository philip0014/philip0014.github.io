export default {
    // return random number with range from min (inclusive) to max (exclusive)
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    // return list of non duplicate number from min (inclusive) to max (exclusive)
    fisherYates: function(min, max) {
        let res = [];
        for (let i = min; i < max; i++) {
            res.push(i);
        }

        for (let i = res.length; i > 0; i--) {
            let rand = this.random(0, i);
            if (i - 1 === rand) continue;
            res[i - 1] += res[rand];
            res[rand] = res[i - 1] - res[rand];
            res[i - 1] -= res[rand];
        }
        return res;
    }
}
