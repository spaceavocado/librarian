import { probe } from '..'
import { Evaluable, EvaluationResult } from '../Evaluable'
import { or } from '../or'
import { combine, ProbeResult } from '../probe'
import { term } from '../term'

describe('librarian / core', () => {
  describe('probe', () => {
    const e0 = term('dog')
    const e1 = term('green')
    const e2 = or()(e0, e1)

    describe('combine', () => {
      it.each<[Evaluable, Record<symbol, EvaluationResult>, ProbeResult]>([
        [e0, { [e0.id]: false }, { ...e0, result: false, descendants: [] }],
        [
          e2,
          { [e2.id]: [], [e0.id]: false, [e1.id]: [] },
          {
            ...e2,
            result: [],
            descendants: [
              {
                ...e0,
                result: false,
                descendants: [],
              },
              {
                ...e1,
                result: [],
                descendants: [],
              },
            ],
          },
        ],
      ])(
        'evaluable %p with %p evaluation map should be combined as %s',
        (evaluable, evaluationMap, expected) => {
          expect(combine(evaluable, evaluationMap)).toStrictEqual(expected)
        }
      )
    })

    describe('execute', () => {
      it.each([
        [e0, [false, { ...e0, result: false, descendants: [] }]],
        [
          e1,
          [
            [
              {
                index: 0,
                length: 5,
                match: 'green',
                term: 'green',
              },
            ],
            {
              ...e1,
              result: [
                {
                  index: 0,
                  length: 5,
                  match: 'green',
                  term: 'green',
                },
              ],
              descendants: [],
            },
          ],
        ],
        [
          e2,
          [
            [
              {
                index: 0,
                length: 5,
                match: 'green',
                term: 'green',
              },
            ],
            {
              ...e2,
              result: [
                {
                  index: 0,
                  length: 5,
                  match: 'green',
                  term: 'green',
                },
              ],
              descendants: [
                {
                  ...e0,
                  result: false,
                  descendants: [],
                },
                {
                  ...e1,
                  result: [
                    {
                      index: 0,
                      length: 5,
                      match: 'green',
                      term: 'green',
                    },
                  ],
                  descendants: [],
                },
              ],
            },
          ],
        ],
      ])('evaluable %p is executed as %s', (evaluable, expected) => {
        expect(probe(evaluable).execute('green')).toStrictEqual(expected)
      })
    })
  })
})
