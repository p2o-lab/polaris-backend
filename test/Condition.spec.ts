import {suite, test} from "mocha-typescript";
import {Condition, TimeCondition} from "../src/model/Condition";
import * as assert from "assert";
import {catRecipe} from "../src/config/logging";
import {ConditionType} from "pfe-ree-interface";

@suite
class ConditionTest {
    @test TimeCondition() {
        let cond = new TimeCondition({type: ConditionType.time, duration: 3});

        assert.equal(cond.fulfilled, false);

        cond.listen(() => {
            assert.equal(cond.fulfilled, true);
        });

        assert.equal(cond.fulfilled, false);
    }

    @test
    AndCondition() {
        let condition = Condition.create({
            type: ConditionType.and,
            conditions: [
                {type: ConditionType.time, duration: 2},
                {type: ConditionType.time, duration: 0.5}
            ]
        }, undefined, undefined);
        condition.listen((status) => catRecipe.info(`Status: ${status}`));
    }

}