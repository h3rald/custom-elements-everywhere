/* eslint-disable */
/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from "chai";

import h3 from "@h3rald/h3";

import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent,
  eventResults
} from "./components";

describe("basic support", function () {
  describe("no children", function () {
    it("can display a Custom Element with no children", async function () {
      this.weight = 3;
      await h3.init(ComponentWithoutChildren);
      let wc = document.querySelector("#wc");
      expect(wc).to.exist;
    });
  });

  describe("with children", function () {
    function expectHasChildren(wc) {
      expect(wc).to.exist;
      let shadowRoot = wc.shadowRoot;
      let heading = shadowRoot.querySelector("h1");
      expect(heading).to.exist;
      expect(heading.textContent).to.eql("Test h1");
      let paragraph = shadowRoot.querySelector("p");
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.eql("Test p");
    }

    it("can display a Custom Element with children in a Shadow Root", async function () {
      this.weight = 3;
      await h3.init(ComponentWithChildren);
      let wc = document.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function () {
      this.weight = 3;
      await h3.init(ComponentWithChildrenRerender);
      let wc = document.querySelector("#wc");
      //await new Promise(requestAnimationFrame);
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", async function () {
      this.weight = 3;
      await h3.init(ComponentWithDifferentViews);
      let ce = document.querySelector("#ce");
      let wc = document.querySelector("#wc");
      expectHasChildren(wc);
      ce.toggle();
      //await new Promise(requestAnimationFrame);
      let dummy = document.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      ce.toggle();
      //await new Promise(requestAnimationFrame);
      wc = document.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", async function () {
    it("will pass boolean data as either an attribute or a property", async function () {
      this.weight = 3;
      await h3.init(ComponentWithProperties);
      let wc = document.querySelector("#wc");
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", async function () {
      this.weight = 3;
      await h3.init(ComponentWithProperties);
      let wc = document.querySelector("#wc");
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", async function () {
      this.weight = 3;
      await h3.init(ComponentWithProperties);
      let wc = document.querySelector("#wc");
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("H3");
    });
  });

  describe("events", async function () {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", async function () {
      this.weight = 3;
      await h3.init(ComponentWithImperativeEvent);
      let wc = document.querySelector("#wc");
      let handled = document.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      //await new Promise(requestAnimationFrame);
      expect(handled.textContent).to.eql("true");
    });
  });
});
