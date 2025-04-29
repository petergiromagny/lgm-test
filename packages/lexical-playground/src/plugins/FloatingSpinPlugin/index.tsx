/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$findMatchingParent} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {$isSpinNode} from '../../nodes/SpinNode';
import {getSelectedNode} from '../../utils/getSelectedNode';

function FloatingSpin({
  spinElement,
}: {
  spinElement: HTMLElement | null;
}): JSX.Element {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boxElem = boxRef.current;

    if (boxElem && spinElement) {
      const spinRect = spinElement.getBoundingClientRect();
      boxElem.style.top = `${spinRect.bottom + 1}px`;
      boxElem.style.left = `${spinRect.left}px`;
    }
  }, [spinElement]);

  return (
    <div ref={boxRef} className="floating-spin">
      Hello there!
    </div>
  );
}

export default function FloatingSpinPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [showFloatingSpin, setShowFloatingSpin] = useState(false);
  const [spinElement, setSpinElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    return editor.registerCommand(
      CLICK_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection);
          const spinNode = $findMatchingParent(node, $isSpinNode);

          if (spinNode) {
            const spinDOMNode = editor.getElementByKey(spinNode.getKey());
            if (spinDOMNode) {
              setSpinElement(spinDOMNode);
              setShowFloatingSpin((prevState) => !prevState);
              return true;
            }
          }
          setSpinElement(null);
          setShowFloatingSpin(false);
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return showFloatingSpin
    ? createPortal(<FloatingSpin spinElement={spinElement} />, anchorElem)
    : null;
}
