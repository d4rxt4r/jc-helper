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

         isValid: null,

         isAutoStep: false,
         timerId: null,

         modelType: ModelType.MANUAL,

         testData: TESTS,
         selectedData: 5
      };
   },
   methods: {
      nextStep() {
         // for (let i = 0; i < 1000; i++) {
         this.renderer.nextStep();
         this.validate();
         // }
         this.viewModel = this.renderer.getModel();
      },

      validate() {
         this.isValid = this.renderer.validateModel();
         if (this.isValid) {
            this.viewModel = this.renderer.getModel();
            clearInterval(this.timerId);
         }
      },

      init() {
         this.viewModel = this.renderer.getModel();
         const { rows, columns } = this.renderer.getSize();
         this.viewHeight = rows;
         this.viewWidth = columns;
      }
   },
   watch: {
      selectedData(dataIndex) {
         this.renderer = new Renderer(TESTS[dataIndex]);
         this.init();
      },
      isAutoStep(state) {
         if (this.timerId && !state) {
            clearInterval(this.timerId);
         }

         if (state) {
            this.timerId = setInterval(() => {
               this.nextStep();
            }, 1);
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
