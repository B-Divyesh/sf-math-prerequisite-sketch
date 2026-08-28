export type Answer = { label: string; correct?: boolean; next?: string; note: string };

export type Concept = {
  id: string;
  label: string;
  band: 'Foundations' | 'Algebra' | 'Functions' | 'Calculus';
  prerequisiteIds: string[];
  question: string;
  answers: Answer[];
  repair: string;
  example: string;
  transfer: string;
  transferAnswer: string;
};

export const concepts: Concept[] = [
  {
    id: 'number-sense', label: 'Number sense', band: 'Foundations', prerequisiteIds: [],
    question: 'Which number is greatest?',
    answers: [
      { label: '0.7', correct: true, note: 'Yes. Seven tenths is greater than sixty-eight hundredths.' },
      { label: '0.68', note: 'Compare place values from left to right.', next: 'number-sense' },
      { label: 'They are equal', note: 'Write 0.7 as 0.70, then compare.', next: 'number-sense' }
    ],
    repair: 'Line up place values. Add trailing zeros when they make a comparison easier.',
    example: '<math><mn>0.7</mn><mo>=</mo><mn>0.70</mn><mo>&gt;</mo><mn>0.68</mn></math>',
    transfer: 'Which is greater: 0.305 or 0.35?', transferAnswer: '0.35 is greater because 0.350 > 0.305.'
  },
  {
    id: 'fractions', label: 'Fractions', band: 'Foundations', prerequisiteIds: ['number-sense'],
    question: 'What is 1/3 + 1/6?',
    answers: [
      { label: '1/2', correct: true, note: 'Yes. 2/6 + 1/6 = 3/6 = 1/2.' },
      { label: '2/9', note: 'Add fractions after making their denominators equal.', next: 'number-sense' },
      { label: '2/6', note: 'Convert 1/3 to 2/6 before adding.', next: 'number-sense' }
    ],
    repair: 'Use a common denominator, add the numerators, then simplify.',
    example: '<math><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>6</mn></mfrac><mo>=</mo><mfrac><mn>3</mn><mn>6</mn></mfrac><mo>=</mo><mfrac><mn>1</mn><mn>2</mn></mfrac></math>',
    transfer: 'Compute 3/4 − 1/8.', transferAnswer: '5/8. Rewrite 3/4 as 6/8, then subtract 1/8.'
  },
  {
    id: 'signed-numbers', label: 'Signed numbers', band: 'Foundations', prerequisiteIds: ['number-sense'],
    question: 'What is −4 − (−7)?',
    answers: [
      { label: '3', correct: true, note: 'Yes. Subtracting −7 is the same as adding 7.' },
      { label: '−11', note: 'A minus before a negative changes the operation to addition.', next: 'number-sense' },
      { label: '−3', note: 'After changing to −4 + 7, move seven places right.', next: 'number-sense' }
    ],
    repair: 'Treat subtracting a negative as adding its positive opposite.',
    example: '<math><mo>−</mo><mn>4</mn><mo>−</mo><mo>(</mo><mo>−</mo><mn>7</mn><mo>)</mo><mo>=</mo><mo>−</mo><mn>4</mn><mo>+</mo><mn>7</mn><mo>=</mo><mn>3</mn></math>',
    transfer: 'Compute 5 − (−9).', transferAnswer: '14. Change the subtraction to 5 + 9.'
  },
  {
    id: 'order-operations', label: 'Order of operations', band: 'Foundations', prerequisiteIds: ['signed-numbers'],
    question: 'What is 3 + 2 × 5?',
    answers: [
      { label: '13', correct: true, note: 'Yes. Multiply before adding.' },
      { label: '25', note: 'Multiplication comes before addition here.', next: 'signed-numbers' },
      { label: '17', note: 'Work one operation at a time, starting with multiplication.', next: 'signed-numbers' }
    ],
    repair: 'Do grouping and powers first, then multiplication, division, addition, and subtraction.',
    example: '<math><mn>3</mn><mo>+</mo><mn>2</mn><mo>×</mo><mn>5</mn><mo>=</mo><mn>3</mn><mo>+</mo><mn>10</mn><mo>=</mo><mn>13</mn></math>',
    transfer: 'Compute 18 ÷ 3 + 4.', transferAnswer: '10. Divide first, then add.'
  },
  {
    id: 'expressions', label: 'Algebraic expressions', band: 'Algebra', prerequisiteIds: ['order-operations'],
    question: 'Simplify 3x + 2x − 4.',
    answers: [
      { label: '5x − 4', correct: true, note: 'Yes. 3x and 2x are like terms.' },
      { label: '5x', note: 'The constant −4 remains.', next: 'order-operations' },
      { label: 'x − 4', note: 'Add the coefficients 3 and 2.', next: 'signed-numbers' }
    ],
    repair: 'Combine terms only when their variable parts match exactly.',
    example: '<math><mn>3</mn><mi>x</mi><mo>+</mo><mn>2</mn><mi>x</mi><mo>−</mo><mn>4</mn><mo>=</mo><mn>5</mn><mi>x</mi><mo>−</mo><mn>4</mn></math>',
    transfer: 'Simplify 7y − 3y + 2.', transferAnswer: '4y + 2.'
  },
  {
    id: 'linear-equations', label: 'Linear equations', band: 'Algebra', prerequisiteIds: ['fractions', 'expressions'],
    question: 'Solve 3x + 5 = 14.',
    answers: [
      { label: 'x = 3', correct: true, note: 'Yes. Subtract 5, then divide by 3.' },
      { label: 'x = 19/3', note: 'Undo the added 5 before dividing.', next: 'expressions' },
      { label: 'x = 9', note: 'After subtracting 5, divide both sides by 3.', next: 'fractions' }
    ],
    repair: 'Undo operations in reverse order and make the same change on both sides.',
    example: '<math><mn>3</mn><mi>x</mi><mo>+</mo><mn>5</mn><mo>=</mo><mn>14</mn><mo>⇒</mo><mn>3</mn><mi>x</mi><mo>=</mo><mn>9</mn><mo>⇒</mo><mi>x</mi><mo>=</mo><mn>3</mn></math>',
    transfer: 'Solve 4x − 7 = 13.', transferAnswer: 'x = 5.'
  },
  {
    id: 'slope', label: 'Slope', band: 'Functions', prerequisiteIds: ['fractions', 'signed-numbers'],
    question: 'What is the slope from (1, 2) to (3, 8)?',
    answers: [
      { label: '3', correct: true, note: 'Yes. The rise is 6 and the run is 2.' },
      { label: '1/3', note: 'Slope is vertical change divided by horizontal change.', next: 'fractions' },
      { label: '5', note: 'Subtract matching coordinates before dividing.', next: 'signed-numbers' }
    ],
    repair: 'Subtract y-values and x-values in the same point order, then divide.',
    example: '<math><mi>m</mi><mo>=</mo><mfrac><mrow><mn>8</mn><mo>−</mo><mn>2</mn></mrow><mrow><mn>3</mn><mo>−</mo><mn>1</mn></mrow></mfrac><mo>=</mo><mn>3</mn></math>',
    transfer: 'Find the slope from (−1, 4) to (2, 10).', transferAnswer: '2. The rise is 6 and the run is 3.'
  },
  {
    id: 'function-notation', label: 'Function notation', band: 'Functions', prerequisiteIds: ['linear-equations'],
    question: 'If f(x) = 2x + 1, what is f(4)?',
    answers: [
      { label: '9', correct: true, note: 'Yes. Replace x with 4.' },
      { label: '2x + 5', note: 'f(4) asks you to replace every x with 4.', next: 'expressions' },
      { label: '8', note: 'Keep the added 1 after substitution.', next: 'order-operations' }
    ],
    repair: 'Read f(a) as “replace each x in the rule with a.”',
    example: '<math><mi>f</mi><mo>(</mo><mn>4</mn><mo>)</mo><mo>=</mo><mn>2</mn><mo>(</mo><mn>4</mn><mo>)</mo><mo>+</mo><mn>1</mn><mo>=</mo><mn>9</mn></math>',
    transfer: 'If g(t) = t² − 3, find g(5).', transferAnswer: '22.'
  },
  {
    id: 'factoring', label: 'Factoring', band: 'Algebra', prerequisiteIds: ['expressions'],
    question: 'Which is a factorization of x² + 5x + 6?',
    answers: [
      { label: '(x + 2)(x + 3)', correct: true, note: 'Yes. 2 × 3 = 6 and 2 + 3 = 5.' },
      { label: '(x + 1)(x + 6)', note: 'The constants multiply to 6 but add to 7.', next: 'expressions' },
      { label: '(x − 2)(x − 3)', note: 'Two negative constants give a negative middle term.', next: 'signed-numbers' }
    ],
    repair: 'Find two numbers whose product is the constant and whose sum is the middle coefficient.',
    example: '<math><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>5</mn><mi>x</mi><mo>+</mo><mn>6</mn><mo>=</mo><mo>(</mo><mi>x</mi><mo>+</mo><mn>2</mn><mo>)</mo><mo>(</mo><mi>x</mi><mo>+</mo><mn>3</mn><mo>)</mo></math>',
    transfer: 'Factor x² + 7x + 12.', transferAnswer: '(x + 3)(x + 4).'
  },
  {
    id: 'exponents', label: 'Exponents', band: 'Algebra', prerequisiteIds: ['expressions'],
    question: 'Simplify x³ · x².',
    answers: [
      { label: 'x⁵', correct: true, note: 'Yes. Add exponents when multiplying the same base.' },
      { label: 'x⁶', note: 'Multiplication of powers adds the exponents.', next: 'expressions' },
      { label: '2x⁵', note: 'No new coefficient appears when each coefficient is 1.', next: 'number-sense' }
    ],
    repair: 'For the same base, multiplication adds exponents and division subtracts them.',
    example: '<math><msup><mi>x</mi><mn>3</mn></msup><mo>·</mo><msup><mi>x</mi><mn>2</mn></msup><mo>=</mo><msup><mi>x</mi><mn>5</mn></msup></math>',
    transfer: 'Simplify a⁷ ÷ a³.', transferAnswer: 'a⁴, when a is not zero.'
  },
  {
    id: 'limits', label: 'Limits', band: 'Calculus', prerequisiteIds: ['function-notation', 'factoring'],
    question: 'For f(x) = 2x + 1, what does f(x) approach as x approaches 3?',
    answers: [
      { label: '7', correct: true, note: 'Yes. This continuous rule approaches its value at 3.' },
      { label: '3', note: 'Evaluate the function near the input 3.', next: 'function-notation' },
      { label: 'It cannot be known', note: 'A polynomial is continuous, so substitution works here.', next: 'factoring' }
    ],
    repair: 'A limit describes the output approached as the input moves close to a value.',
    example: '<math><munder><mo>lim</mo><mrow><mi>x</mi><mo>→</mo><mn>3</mn></mrow></munder><mo>(</mo><mn>2</mn><mi>x</mi><mo>+</mo><mn>1</mn><mo>)</mo><mo>=</mo><mn>7</mn></math>',
    transfer: 'Find the limit of x² as x approaches 4.', transferAnswer: '16.'
  },
  {
    id: 'derivatives', label: 'Derivatives', band: 'Calculus', prerequisiteIds: ['limits', 'exponents', 'slope'],
    question: 'What is the derivative of x²?',
    answers: [
      { label: '2x', correct: true, note: 'Yes. The power rule lowers the exponent by one.' },
      { label: 'x', note: 'A derivative is a changing slope, built from a limit.', next: 'limits' },
      { label: '2', note: 'Lower the exponent, but keep x to the new first power.', next: 'exponents' }
    ],
    repair: 'A derivative is the slope at one input. For xⁿ, multiply by n and lower the exponent by one.',
    example: '<math><mfrac><mi>d</mi><mrow><mi>d</mi><mi>x</mi></mrow></mfrac><msup><mi>x</mi><mn>2</mn></msup><mo>=</mo><mn>2</mn><mi>x</mi></math>',
    transfer: 'Differentiate x³ + 4x.', transferAnswer: '3x² + 4.'
  },
  {
    id: 'integrals', label: 'Integrals', band: 'Calculus', prerequisiteIds: ['derivatives', 'function-notation'],
    question: 'Which function has derivative 2x?',
    answers: [
      { label: 'x² + C', correct: true, note: 'Yes. C allows every constant vertical shift.' },
      { label: '2', note: 'Reverse the power rule and include a constant.', next: 'derivatives' },
      { label: '2x²', note: 'Differentiate your choice to check it.', next: 'function-notation' }
    ],
    repair: 'An indefinite integral reverses differentiation and includes an unknown constant.',
    example: '<math><mo>∫</mo><mn>2</mn><mi>x</mi><mspace width=".2em"/><mi>d</mi><mi>x</mi><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mi>C</mi></math>',
    transfer: 'Find an antiderivative of 3x².', transferAnswer: 'x³ + C.'
  }
];

export const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));

export const demoSketch = {
  problem: 'Differentiate f(x) = (x + 3)².',
  stopped: 'I expanded (x + 3)², but I am unsure what the derivative step changes.',
  goal: 'derivatives'
};
