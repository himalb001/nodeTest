var expect = require('chai').expect;
const subtext = require("../subtext");
const constant = require("../constants");
describe('Subtext', function () {

    describe('#getTextToSearchFromJSON()',()=> {

        it('should return text',()=> {
            expect(subtext.getTextToSearchFromJSON({ text: "Text" })).to.be.equal("Text");
        });
        it('should throw if null value is passed',()=> {
            expect(() => subtext.getTextToSearchFromJSON(null)).to.throw()
        });

        it('should throw if json doesnt have key named text',()=> {
            expect(() => subtext.getTextToSearchFromJSON({texts: ""})).to.throw()
        });
    });

    describe('#getIndicesForString()', () => {

        it('should return blank array if subtext is blank', () => {
            const text = "String to search";
            expect(subtext.getIndicesForString([], text).length).to.be.equal(0);
        });

        it('should return blank array if searchString is blank', () => {
            const text = "";
            expect(subtext.getIndicesForString(["searchText A", "searchText B"], text).length).to.be.equal(0);
        });

        it('should return correct indices for upper and lowercase', () => {
            const text = "Pepep and hello";
            expect(subtext.getIndicesForString(["pe", "pep"], text)).to.eql([{ subtext: "pe", result: "1, 3" }, { subtext: "pep", result: "1, 3"}]);
        });
    })

    describe('#substringMatchAtIndex()', () => {

        it('should match correct values', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "Pe", 0)).to.be.true;
        });

        it('should not match correct values', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "pe", 1)).to.be.false;
        });

        it('should not overflow subtext', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "low", 13)).to.be.false;
        });

        it('should work at text bounds', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "lo", 13)).to.be.true;
        });
        
        it('should not work with negative numbers', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "lo", -13)).to.be.false;
        });

        it('should not work with number bigger than text size', () => {
            const text = "Pepep and hello";
            expect(subtext.substringMatchAtIndex(text, "lo", 400)).to.be.false;
        });

    })


    describe('#createDynamicKeyValObject()', () => {

        it('should generate correct responses', () => {
            const res = subtext.createDynamicKeyValObject("keyA", [1,2,3]);
            expect(res).to.eql({subtext:"keyA", result: "1, 2, 3"});
        });

        it('should accept null value', () => {
            const res = subtext.createDynamicKeyValObject("keyA", null);
            expect(res).to.eql({ subtext: "keyA", result: "<No Output>" });
        });

        it('should accept single character as key', () => {
            const res = subtext.createDynamicKeyValObject("k", [1, 2, 3]);
            expect(res).to.eql({ subtext: "k", result: "1, 2, 3" });
        });

        it('should accept space character as key', () => {
            const res = subtext.createDynamicKeyValObject(" ", [1, 2, 3]);
            expect(res).to.eql({ subtext: " ", result: "1, 2, 3" });
        });

        it('should work for null as key', () => {
            const res = subtext.createDynamicKeyValObject("", [1, 2, 3]);
            expect(res).to.eql({ subtext: "", result: "1, 2, 3" });
        });
        it('should work for blank character as key', () => {
            const res = subtext.createDynamicKeyValObject(null, [1, 2, 3]);
            expect(res).to.eql({ subtext: "", result: "1, 2, 3" });
        });

    })

});