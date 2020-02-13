var expect = require('chai').expect;
const fizzbuzz = require("../fizzbuzz");
const constant = require("../constants");



describe('FizzBuzz', function () {

    describe('#getMinMaxRange()', () => {

        it('should work with normal values', () => {
            expect(fizzbuzz.getMinMaxRange({lower:20, upper:40})).to.eql([20,40]);
        });


        it('should convert values to 0 if they are less than 0', () => {
            expect(fizzbuzz.getMinMaxRange({ lower: -20, upper: 40 })).to.eql([0, 40]);
        });

        it('should swap if lower is higher than lower', () => {
            expect(fizzbuzz.getMinMaxRange({ lower: 50, upper: 40 })).to.eql([40, 50]);
        });

        it('should throw if json is of invalid structure', () => {
            expect(()=>fizzbuzz.getMinMaxRange({ lowers: 50, upper: 40 })).to.throw;
        });

        it('should throw if lower/upper bound are non-numeric text', () => {
            expect(()=>fizzbuzz.getMinMaxRange({ lower: "abc", upper: 40 })).to.throw;
        });

        it('should not throw if lower/upper bound are numeric text', () => {
            expect(fizzbuzz.getMinMaxRange({ lower: "20", upper: 40 })).to.eql([20,40]);
        });
    });


    describe('#getMinMaxRange()', () => {
        it('should work with correct JSON structure', () => {

            const jsonMock = {
                outputDetails: [{
                    divisor: 3,
                    output: "Boss"
                }, {
                    divisor: 5,
                    output: "Hogg"
                }]
            }

            const response = new Map();
            response.set(3,"Boss");
            response.set(5, "Hogg");
            
            expect(fizzbuzz.getDivisorMap(jsonMock)).to.eql(response);

        });

        it('should not work if outputDetails doesnt exist in JSON object', () => {

            const jsonMock = [{
                divisor: 3,
                output: "Boss"
            }, {
                divisor: 5,
                output: "Hogg"
            }]

            const response = new Map();
            expect(fizzbuzz.getDivisorMap(jsonMock)).to.eql(response);
        });
       
        
        
    })
    
});