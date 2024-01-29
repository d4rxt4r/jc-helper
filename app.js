import Renderer from './dist/Renderer.js';
import { ModelType } from './dist/Types.js';
import { TESTS } from './dist/TestData.js';

const app = Vue.createApp({
   data() {
      return {
         renderer: null,
         viewWidth: 0,
         viewHeight: 0,
         viewModel: [],

         isValid: false,

         isAutoStep: false,
         stepSize: 1,
         maxStepSize: 10_000,
         timerId: null,

         modelType: ModelType.MANUAL,

         testData: TESTS,
         selectedData: 5
      };
   },
   methods: {
      startTimer() {
         if (this.timerId) {
            clearInterval(this.timerId);
         }

         this.timerId = setTimeout(() => {
            this.nextStep();
         }, 1);
      },

      stopTimer() {
         if (this.timerId) {
            clearInterval(this.timerId);
         }
      },

      nextStep() {
         for (let i = 0; i < this.stepSize; i++) {
            this.renderer.nextStep();
            this.validate();
         }
         this.viewModel = this.renderer.getModel();

         if (this.isAutoStep && !this.isValid) {
            this.startTimer();
         }
      },

      validate() {
         this.isValid = this.renderer.validateModel();
         if (this.isValid) {
            this.viewModel = this.renderer.getModel();
            this.stopTimer();
         }
      },

      init() {
         this.viewModel = this.renderer.getModel();
         const { rows, columns } = this.renderer.getSize();
         this.viewHeight = rows;
         this.viewWidth = columns;
         this.isAutoStep = false;
         this.validate();
      }
   },
   watch: {
      selectedData(dataIndex) {
         this.renderer = new Renderer(TESTS[dataIndex]);
         this.init();
      },
      isAutoStep(state) {
         if (!state || this.isValid) {
            this.stopTimer();
         }

         if (this.isValid) {
            return;
         }

         if (state) {
            this.startTimer();
         }
      }
   },
   beforeMount() {
      this.renderer = new Renderer(TESTS[this.selectedData]);
   },
   mounted() {
      this.init();
   },
   unmounted() {
      if (this.timerId) {
         clearInterval(this.timerId);
      }
   }
});

app.mount('#app');
