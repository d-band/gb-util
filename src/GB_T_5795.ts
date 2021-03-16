import assert from './assert';
import { computeCC } from './GB_T_17710';
import groups from './isbn_groups';

export function normalize(isbn: string): string {
  if (isbn) {
    return isbn.replace(/[^0-9X]/g, '');
  }
  return '';
}

export function compute(isbn: string): string {
  isbn = normalize(isbn);
  if (isbn.length >= 12) {
    const W = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
    const alphabet = '0123456789';
    return computeCC(isbn, 10, W, alphabet);
  }
  const W = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const alphabet = '0123456789X';
  return computeCC(isbn, 11, W, alphabet);
}

export function isValid(isbn: string): boolean {
  isbn = normalize(isbn);
  if (isbn.length === 10 || isbn.length === 13) {
    return compute(isbn) === isbn.slice(-1);
  }
  return false;
}

interface ISBNGroup {
  prefix: string;
  id: string;
  name: string;
  ranges: string[][];
}

interface ISBN {
  prefix: string;
  isbn10: string;
  isbn13: string;
  isIsbn10: boolean;
  group?: string;
  groupName?: string;
  publisher?: string;
  article?: string;
  isbn10h?: string;
  isbn13h?: string;
}

export function getGroup(isbn13: string): null | ISBNGroup {
  const prefix = isbn13.slice(0, 3);
  for (let i = 6; i > 0; i--) {
    const id = isbn13.slice(3, 3 + i);
    const obj = groups[`${prefix}-${id}`];
    if (obj) {
      return { prefix, id, ...obj };
    }
  }
  return null;
}

export function toIsbn13(isbn10: string): string {
  const s = '978' + isbn10.slice(0, 9);
  return s + compute(s);
}

export function toIsbn10(isbn13: string): string {
  const s = isbn13.slice(3, 12);
  return s + compute(s);
}

export function parse(isbn: string): ISBN {
  isbn = normalize(isbn);
  assert(isValid(isbn), 'INVALID_ISBN', 'ISBN is invalid');
  const isIsbn10 = isbn.length === 10;
  const obj: ISBN = {
    isIsbn10,
    isbn10: isIsbn10 ? isbn : toIsbn10(isbn),
    isbn13: isIsbn10 ? toIsbn13(isbn) : isbn,
    prefix: isIsbn10 ? '978' : isbn.slice(0, 3)
  };
  const group = getGroup(obj.isbn13);
  if (group) {
    obj.group = group.id;
    obj.groupName = group.name;
    const start = (obj.prefix + obj.group).length;
    for (const [min, max] of group.ranges) {
      const end = start + min.length;
      const publisher = obj.isbn13.slice(start, end);
      if (min <= publisher && publisher <= max) {
        obj.publisher = publisher;
        obj.article = obj.isbn13.slice(end, 12);
        const s = `${obj.group}-${obj.publisher}-${obj.article}`;
        obj.isbn10h = `${s}-${obj.isbn10.slice(-1)}`;
        obj.isbn13h = `${obj.prefix}-${s}-${obj.isbn13.slice(-1)}`;
        return obj;
      }
    }
  }
  return obj;
}
