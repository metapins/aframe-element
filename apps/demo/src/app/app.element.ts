import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import 'aframe';
import 'aframe-blink-controls';
import 'aframe-environment-component';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement as customLitElement } from 'lit/decorators.js';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';

class TictactoeService {
  public player$ = new BehaviorSubject<string>('X');
  public pawns$ = new BehaviorSubject<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  public async add(line: number, column: number) {
    const pawns = JSON.parse(JSON.stringify(await firstValueFrom(this.pawns$)));
    const player = await firstValueFrom(this.player$);

    if (pawns[line][column] !== '') return;
    pawns[line][column] = player;
    this.pawns$.next(pawns);
    this.player$.next(player === 'X' ? 'O' : 'X');
  }

  public reset() {
    this.pawns$.next([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  }
}
const tictactoeService = new TictactoeService();

@customLitElement('aframe-element-root')
export class AppElement extends LitElement {
  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private reset() {
    tictactoeService.reset();
  }

  protected render(): TemplateResult {
    return html`
      <a-scene cursor="rayOrigin: mouse; fuse: false;">
        <a-entity
          environment="preset: forest; shadow: false; skyType: atmosphere;"
        ></a-entity>

        <a-entity id="player" position="0 1 5">
          <a-entity
            id="camera"
            camera
            wasd-controls
            look-controls="touchEnabled: false; magicWindowTrackingEnabled: false;"
          ></a-entity>

          <a-entity
            laser-controls="hand: left;"
            blink-controls="cameraRig: #player; teleportOrigin: #camera; collisionEntities: .environmentGround;"
            raycaster="objects: .clickable;"
          ></a-entity>
          <a-entity
            laser-controls="hand: right;"
            blink-controls="cameraRig: #player; teleportOrigin: #camera; collisionEntities: .environmentGround;"
            raycaster="objects: .clickable;"
          ></a-entity>
        </a-entity>

        <!-- line 1 -->
        <a-pawn _line="0" _column="0" position="-1.1 2.8 0"></a-pawn>
        <a-pawn _line="0" _column="1" position="0 2.8 0"></a-pawn>
        <a-pawn _line="0" _column="2" position="1.1 2.8 0"></a-pawn>

        <!-- line 2 -->
        <a-pawn _line="1" _column="0" position="-1.1 1.7 0"></a-pawn>
        <a-pawn _line="1" _column="1" position="0 1.7 0"></a-pawn>
        <a-pawn _line="1" _column="2" position="1.1 1.7 0"></a-pawn>

        <!-- line 3 -->
        <a-pawn _line="2" _column="0" position="-1.1 0.6 0"></a-pawn>
        <a-pawn _line="2" _column="1" position="0 0.6 0"></a-pawn>
        <a-pawn _line="2" _column="2" position="1.1 0.6 0"></a-pawn>

        <a-sphere
          class="clickable"
          @click=${() => this.reset()}
          position="2.5 0 0"
          scale="0.5 0.5 0.5"
        ></a-sphere>
      </a-scene>
    `;
  }
}

@customElement('pawn')
export class PawnElement extends AFrameElement {
  public static schema = {
    line: { type: 'int' },
    column: { type: 'int' },
  };

  private background$ = new BehaviorSubject<string>('grey');
  private player$ = tictactoeService.pawns$.pipe(
    map((pawns) => pawns[this.data.line][this.data.column])
  );

  private onClick() {
    tictactoeService.add(this.data.line, this.data.column);
  }

  render() {
    return html`
      <a-box
        class="clickable"
        scale="1 1 0.1"
        material="color: ${observe(this.background$)}"
        @click=${() => this.onClick()}
        @mouseenter=${() => this.background$.next('white')}
        @mouseleave=${() => this.background$.next('grey')}
      ></a-box>

      ${observe(this.player$, (player) =>
        !player
          ? html``
          : html`
              <a-text
                value="${player}"
                position="-0.29 0 0.05"
                scale="3 3 1"
              ></a-text>
            `
      )}
    `;
  }
}
