/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { alphabetPad, baseToString, stringToBase } from "matrix-js-sdk/src/utils";

import { reorder } from "./arrays";

export const ALPHABET_START = 0x20;
export const ALPHABET_END = 0x7E;
export const ALPHABET = new Array(1 + ALPHABET_END - ALPHABET_START)
    .fill(undefined)
    .map((_, i) => String.fromCharCode(ALPHABET_START + i))
    .join("");

export const midPointsBetweenStrings = (
    a: string,
    b: string,
    count: number,
    maxLen: number,
    alphabet = ALPHABET,
): string[] => {
    const padN = Math.min(Math.max(a.length, b.length), maxLen);
    const padA = alphabetPad(a, padN, alphabet);
    const padB = alphabetPad(b, padN, alphabet);
    const baseA = stringToBase(padA, alphabet);
    const baseB = stringToBase(padB, alphabet);

    if (baseB - baseA - BigInt(1) < count) {
        if (padN < maxLen) {
            // this recurses once at most due to the new limit of n+1
            return midPointsBetweenStrings(
                alphabetPad(padA, padN + 1, alphabet),
                alphabetPad(padB, padN + 1, alphabet),
                count,
                padN + 1,
                alphabet,
            );
        }
        return [];
    }

    const step = (baseB - baseA) / BigInt(count + 1);
    const start = BigInt(baseA + step);
    return Array(count).fill(undefined).map((_, i) => baseToString(start + (BigInt(i) * step), alphabet));
};

interface IEntry {
    index: number;
    order: string;
}

export const reorderLexicographically = (
    orders: Array<string | undefined>,
    fromIndex: number,
    toIndex: number,
    maxLen = 50,
): IEntry[] => {
    // sanity check inputs
    if (
        fromIndex < 0 || toIndex < 0 ||
        fromIndex > orders.length || toIndex > orders.length ||
        fromIndex === toIndex
    ) {
        return [];
    }

    // zip orders with their indices to simplify later index wrangling
    const ordersWithIndices: IEntry[] = orders.map((order, index) => ({ index, order }));
    // apply the fundamental order update to the zipped array
    const newOrder = reorder(ordersWithIndices, fromIndex, toIndex);

    // check if we have to fill undefined orders to complete placement
    const orderToLeftUndefined = newOrder[toIndex - 1]?.order === undefined;

    let leftBoundIdx = toIndex;
    let rightBoundIdx = toIndex;

    let canMoveLeft = true;
    const nextBase = newOrder[toIndex + 1]?.order !== undefined
        ? stringToBase(newOrder[toIndex + 1].order)
        : BigInt(Number.MAX_VALUE);

    // check how far left we would have to mutate to fit in that direction
    for (let i = toIndex - 1, j = 1; i >= 0; i--, j++) {
        if (newOrder[i]?.order !== undefined && nextBase - stringToBase(newOrder[i].order) > j) break;
        leftBoundIdx = i;
    }

    // verify the left move would be sufficient
    const firstOrderBase = newOrder[0].order === undefined ? undefined : stringToBase(newOrder[0].order);
    const bigToIndex = BigInt(toIndex);
    if (leftBoundIdx === 0 &&
        firstOrderBase !== undefined &&
        nextBase - firstOrderBase <= bigToIndex &&
        firstOrderBase <= bigToIndex
    ) {
        canMoveLeft = false;
    }

    const canDisplaceRight = !orderToLeftUndefined;
    let canMoveRight = canDisplaceRight;
    if (canDisplaceRight) {
        const prevBase = newOrder[toIndex - 1]?.order !== undefined
            ? stringToBase(newOrder[toIndex - 1]?.order)
            : BigInt(Number.MIN_VALUE);

        // check how far right we would have to mutate to fit in that direction
        for (let i = toIndex + 1, j = 1; i < newOrder.length; i++, j++) {
            if (newOrder[i]?.order === undefined || stringToBase(newOrder[i].order) - prevBase > j) break;
            rightBoundIdx = i;
        }

        // verify the right move would be sufficient
        if (rightBoundIdx === newOrder.length - 1 &&
            (newOrder[rightBoundIdx]
                ? stringToBase(newOrder[rightBoundIdx].order)
                : BigInt(Number.MAX_VALUE)) - prevBase <= (rightBoundIdx - toIndex)
        ) {
            canMoveRight = false;
        }
    }

    // pick the cheaper direction
    const leftDiff = canMoveLeft ? toIndex - leftBoundIdx : Number.MAX_SAFE_INTEGER;
    const rightDiff = canMoveRight ? rightBoundIdx - toIndex : Number.MAX_SAFE_INTEGER;
    if (orderToLeftUndefined || leftDiff < rightDiff) {
        rightBoundIdx = toIndex;
    } else {
        leftBoundIdx = toIndex;
    }

    const prevOrder = newOrder[leftBoundIdx - 1]?.order ?? "";
    const nextOrder = newOrder[rightBoundIdx + 1]?.order
        ?? String.fromCharCode(ALPHABET_END).repeat(prevOrder.length || 1);

    const changes = midPointsBetweenStrings(prevOrder, nextOrder, 1 + rightBoundIdx - leftBoundIdx, maxLen);

    return changes.map((order, i) => ({
        index: newOrder[leftBoundIdx + i].index,
        order,
    }));
};
