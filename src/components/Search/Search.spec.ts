import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Search from "./Search.vue";

describe("Search components", () => {
  it("matches snapshot", () => {
    const wrapper = mount(Search, {
      props: { modelValue: "", dataSet: [] },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("has correct placeholder", () => {
    const wrapper = mount(Search, {
      props: { modelValue: "", placeholder: "Placeholder", dataSet: [] },
    });
    expect(wrapper.find("input[type='text']").exists());
    expect(wrapper.find("input[type='text']").attributes()["placeholder"]).toBe(
      "Placeholder"
    );
  });

  it("shows correct result", () => {
    const dataSet = [
      {
        key: "item-1",
        value: "Item 1",
      },
      {
        key: "item-2",
        value: "Item 2",
      },
      {
        key: "item-3",
        value: "Item 3",
      },
    ];
    const wrapper = mount(Search, {
      props: {
        modelValue: "item-2",
        placeholder: "Placeholder",
        dataSet: dataSet,
      },
    });
    expect(wrapper.findAll(".results-list__item").length).toBe(2);
  });

  it("shows 3 correct results", () => {
    const value = "item-";
    const dataSet = [
      {
        key: "item-1",
        value: "Item 1",
      },
      {
        key: "item-2",
        value: "Item 2",
      },
      {
        key: "item-3",
        value: "Item 3",
      },
    ];

    const wrapper = mount(Search, {
      props: {
        modelValue: value,
        dataSet: dataSet,
      },
    });

    expect(wrapper.vm.filterResults(value).length).toBe(3);
  });

  it("shows no results", () => {
    const value = "unknown";
    const dataSet = [
      {
        key: "item-1",
        value: "Item 1",
      },
      {
        key: "item-2",
        value: "Item 2",
      },
      {
        key: "item-3",
        value: "Item 3",
      },
    ];

    const wrapper = mount(Search, {
      props: {
        modelValue: value,
        dataSet: dataSet,
      },
    });

    expect(wrapper.vm.filterResults(value).length).toBe(0);
  });

  it("shows 2 results", () => {
    const value = "item-1";
    const dataSet = [
      {
        key: "item-1",
        value: "Item 1",
      },
      {
        key: "item-2",
        value: "Item 2",
      },
      {
        key: "item-11",
        value: "Item 11",
      },
    ];

    const wrapper = mount(Search, {
      props: {
        modelValue: value,
        dataSet: dataSet,
      },
    });

    expect(wrapper.vm.filterResults(value).length).toBe(2);
  });
});
