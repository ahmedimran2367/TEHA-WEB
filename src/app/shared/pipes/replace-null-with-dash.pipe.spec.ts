import { ReplaceNullWithDashPipe } from './replace-null-with-dash.pipe';

describe('ReplaceNullWithDashPipe', () => {
  it('create an instance', () => {
    const pipe = new ReplaceNullWithDashPipe();
    expect(pipe).toBeTruthy();
  });
});
