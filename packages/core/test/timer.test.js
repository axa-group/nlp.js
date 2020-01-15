const Timer = require('../src/timer');

describe('Timer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const timer = new Timer();
      expect(timer).toBeDefined();
    });

    test('I can provide a container', () => {
      const container = {};
      const timer = new Timer(container);
      expect(timer.container).toBe(container);
    });

    test('I can provide an object with a container', () => {
      const container = {};
      const timer = new Timer(container);
      expect(timer.container).toBe(container);
    });
  });

  describe('Start', () => {
    test('It should add an hrstart to the input', () => {
      const timer = new Timer();
      const input = {};
      timer.start(input);
      expect(input.hrstart).toBeDefined();
    });
    test('If no input, then do not crash', () => {
      const timer = new Timer();
      const input = undefined;
      timer.start(input);
      expect(input).toBeUndefined();
    });
    test('Run call start', () => {
      const timer = new Timer();
      const input = {};
      timer.run(input);
      expect(input.hrstart).toBeDefined();
    });
  });

  describe('Stop', () => {
    test('It should set an elapsed property to the input', () => {
      const timer = new Timer();
      const input = {};
      timer.start(input);
      timer.stop(input);
      expect(input.elapsed).toBeDefined();
    });
    test('It should remove hrstart', () => {
      const timer = new Timer();
      const input = {};
      timer.start(input);
      timer.stop(input);
      expect(input.hrstart).toBeUndefined();
    });
    test('If not input, then do not crash', () => {
      const timer = new Timer();
      const input = undefined;
      timer.start(input);
      timer.stop(input);
      expect(input).toBeUndefined();
    });
    test('If not timer started on input, then do nothing', () => {
      const timer = new Timer();
      const input = {};
      timer.stop(input);
      expect(input.elapsed).toBeUndefined();
    });
  });
});
