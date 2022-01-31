/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Entity,
  registerComponent,
  registerPrimitive,
  Schema,
  System,
} from 'aframe';
import { html, render, TemplateResult } from 'lit';
import { Camera } from 'three';

export class AFrameElement {
  public static schema: any = {};
  public static dependencies: string[] = [];
  public static multiple = false;

  public __AFRAME_INSTANCE__: any;

  public init(data?: any): void {}
  public pause(): void {}
  public play(): void {}
  public remove(): void {}
  public tick(time: number, timeDelta: number): void {}
  public tock(time: number, timeDelta: number, camera: Camera): void {}
  public update(oldData: any): void {}
  public updateSchema(): void {}

  public extendSchema(update: Schema): void {
    this.__AFRAME_INSTANCE__.extendSchema(update);
  }
  public flushToDOM(): void {
    this.__AFRAME_INSTANCE__.flushToDOM();
  }

  get attrName(): string | undefined {
    return this.__AFRAME_INSTANCE__.attrName;
  }
  get data(): any {
    return this.__AFRAME_INSTANCE__.data;
  }
  get dependencies(): string[] | undefined {
    return this.__AFRAME_INSTANCE__.dependencies;
  }
  get el(): Entity {
    return this.__AFRAME_INSTANCE__.el;
  }
  get id(): string {
    return this.__AFRAME_INSTANCE__.id;
  }
  get initialized(): boolean {
    return this.__AFRAME_INSTANCE__.initialized;
  }
  get multiple(): boolean | undefined {
    return this.__AFRAME_INSTANCE__.multiple;
  }
  get name(): string {
    return this.__AFRAME_INSTANCE__.name;
  }
  get system(): System | undefined {
    return this.__AFRAME_INSTANCE__.system;
  }
  get events(): any {
    return this.__AFRAME_INSTANCE__.events;
  }

  public requestUpdate(): void {
    if (!this.el) return;
    render(this.render(), this.el);
  }

  public render(): TemplateResult {
    return html``;
  }
}
export const customElement = (elementName: string) => (ElementClass: any) => {
  const instances = new Map();

  const getInstance = (aframeInstance: any) => {
    let instance = instances.get(aframeInstance);

    if (!instance) {
      instance = new ElementClass();
      instance.__AFRAME_INSTANCE__ = aframeInstance;
      instances.set(aframeInstance, instance);
    }
    return instance;
  };

  const aFrameElementDefinition = {
    get schema() {
      return ElementClass.schema;
    },
    get dependencies() {
      return ElementClass.dependencies;
    },
    get multiple() {
      return ElementClass.multiple;
    },
    init: function (data?: any): void {
      getInstance(this).init(data);
    },
    pause: function (): void {
      getInstance(this).pause();
    },
    play: function (): void {
      getInstance(this).play();
    },
    remove: function (): void {
      getInstance(this).remove();
      instances.delete(this);
    },
    tick: function (time: number, timeDelta: number): void {
      getInstance(this).tick(time, timeDelta);
    },
    tock: function (time: number, timeDelta: number, camera: Camera): void {
      getInstance(this).tock(time, timeDelta, camera);
    },
    updateSchema: function (): void {
      getInstance(this).updateSchema();
    },
    update: function (oldData: any): void {
      getInstance(this).update(oldData);
      getInstance(this).requestUpdate();
    },
  };

  registerComponent(elementName, aFrameElementDefinition);
  registerPrimitive(`a-${elementName}`, {
    defaultComponents: {
      [elementName]: {},
    },
  });
};
