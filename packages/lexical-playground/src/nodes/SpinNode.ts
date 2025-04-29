/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorConfig, LexicalNode, SerializedTextNode} from 'lexical';

import {$applyNodeReplacement, TextNode} from 'lexical';

export type SerializedSpinNode = SerializedTextNode;

export class SpinNode extends TextNode {
  static getType(): string {
    return 'spin';
  }

  static clone(node: SpinNode): SpinNode {
    return new SpinNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedSpinNode): SpinNode {
    return $createSpinNode().updateFromJSON(serializedNode);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.color = 'red';
    dom.className = 'spin';
    return dom;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createSpinNode(spin: string = ''): SpinNode {
  return $applyNodeReplacement(new SpinNode(spin));
}

export function $isSpinNode(
  node: LexicalNode | null | undefined,
): node is SpinNode {
  return node instanceof SpinNode;
}
