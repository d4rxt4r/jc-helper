const BLANK = 0;
const FILLED = 1;
const MAX_CAP = 50;

function arrayRotate(arr, reverse) {
   if (reverse) arr.unshift(arr.pop());
   else arr.push(arr.shift());
   return arr;
}

const vm = Vue.createApp({
   data() {
      return { width: 5, pattern: null, fillCounts: [], expanded: false };
   },
   computed: {
      initialArray() {
         const result = new Array(this.width).fill(BLANK);

         if (!this.pattern) {
            return result.slice(0, MAX_CAP);
         }

         this.pattern.split(' ').forEach((element) => {
            const tailIndex = result.lastIndexOf(FILLED) + 1;
            const repeats = parseInt(element);
            const start = tailIndex + !!tailIndex;
            if (start >= result.length) {
               return;
            }
            result.fill(1, start, start + repeats);
         });

         return result.slice(0, MAX_CAP);
      },
      combinationsArray() {
         const result = [];

         if (!this.pattern) {
            return result.slice(0, MAX_CAP);
         }

         let lastCombination = this.initialArray.slice(0);
         let sliceEnd = lastCombination.length;
         this.pattern
            .split(' ')
            .reverse()
            .forEach((item) => {
               const itemLength = parseInt(item);
               const sliceStart = lastCombination.slice(0, sliceEnd).lastIndexOf(FILLED) - (itemLength - 1);
               const sliceLength = sliceEnd - sliceStart;

               let slice = lastCombination.slice(0).splice(sliceStart, sliceLength);
               for (let i = 0; i < sliceLength - itemLength; i++) {
                  arrayRotate(slice, true);
                  lastCombination.splice(sliceStart, slice.length, ...slice);
                  result.push(lastCombination.slice(0));
               }

               sliceEnd = sliceEnd - (itemLength + 1);
            });

         return result;
      },
      unitedArray() {
         this.fillCounts = new Array(this.initialArray.length).fill(0);
         this.initialArray.map((val, index) => {
            this.fillCounts[index] = val;
         });

         return this.combinationsArray.reduce((acc, combination) => {
            return acc.map((val, ind) => {
               this.fillCounts[ind] += combination[ind];
               return val && combination[ind];
            });
         }, this.initialArray.slice(0));
      }
   },
   methods: {
      toggleExpand() {
         this.expanded = !this.expanded;
      }
   }
}).mount('#app');
