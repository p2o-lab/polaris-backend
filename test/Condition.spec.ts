import {suite, test} from "mocha-typescript";
import {Condition, StateCondition, TimeCondition} from "../src/model/condition/Condition";
import * as assert from "assert";
import {catRecipe} from "../src/config/logging";

@suite
class ConditionTest {
    @test TimeCondition() {
        let cond = new TimeCondition(2000);

        assert.equal(cond.fulfilled, false);

        cond.listen(() => {
            assert.equal(cond.fulfilled, true);
        });

        assert.equal(cond.fulfilled, false);
    }

    @test StateCondition() {
        let cond = new StateCondition({});

        cond.listen(() => {
            console.log("condition fulfilled")
        });
    }

    @test
    AndCondition() {
        let condition = Condition.create({
            type: "and",
            conditions: [
                {type: "time", delay: "2"},
                {type: "time", delay: "0.5"}
            ]
        });
        condition.listen((status) => catRecipe.info(`Status: ${status}`));
    }

}