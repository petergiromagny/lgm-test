/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {TextNode} from 'lexical';
import type {JSX} from 'react';

import './index.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity';
import {EntityMatch} from '@lexical/text';
import {useCallback, useEffect} from 'react';

import {$createSpinNode, SpinNode} from '../../nodes/SpinNode';

const SPINS_REGEX = /\{\{([^{}|]*\|)+[^{}|]*\}\}/;

export default function SpinsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([SpinNode])) {
      throw new Error('SpinsPlugin: SpinNode not registered on editor');
    }
  }, [editor]);

  const $createSpinNode_ = useCallback((textNode: TextNode): SpinNode => {
    return $createSpinNode(textNode.getTextContent());
  }, []);

  const getSpinMatch = useCallback((text: string): EntityMatch | null => {
    const matchArr = SPINS_REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    const startOffset = matchArr.index;
    const endOffset = startOffset + matchArr[0].length;

    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<SpinNode>(getSpinMatch, SpinNode, $createSpinNode_);

  return null;
}
