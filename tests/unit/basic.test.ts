import { expect } from 'chai';
import { Logger, LogLevel, overrideConsole } from '../../src/index';

if (!process.env.LOG_LEVEL) {
    overrideConsole({
        log() {},
    } as Console);
}

describe('Logger Basic Tests', () => {
    it('should create logger', async () => {
        const log = new Logger('test_basic.ts', 'trace');

        expect(log.fatal('Testing')).to.be.true;
        expect(log.error('Testing')).to.be.true;
        expect(log.warn('Testing')).to.be.true;
        expect(log.normal('Testing')).to.be.true;
        expect(log.info('Testing')).to.be.true;
        expect(log.debug('Testing')).to.be.true;
        expect(log.trace('Testing')).to.be.true;
    });

    it('should update level', async () => {
        const log = new Logger('test_basic.ts');

        expect(log.normal('Good')).to.be.true;
        expect(log.info('Bad')).to.be.false;

        log.setLevel(4);

        expect(log.info('Good')).to.be.true;
        expect(log.debug('Bad')).to.be.false;
    });

    it('should use local storage settings', async () => {
        process.env.LOG_COLOR = 'false';
        process.env.LOG_LEVEL = 'error';

        const log = new Logger('test_basic.ts');

        expect(log.getLogLevelOverride()).to.equal(LogLevel.ERROR);

        expect(log.error('Good')).to.be.true;
        expect(log.warn('Bad')).to.be.false;

        // Clean up
        delete process.env.LOG_COLOR;
        delete process.env.LOG_LEVEL;
    });

    it('should get level rank', async () => {
        const log = new Logger('test_basic.ts');

        log.setLevel('fatal');
        expect(log.level_rank).to.equal(0);

        log.setLevel('trace');
        expect(log.level_rank).to.equal(6);
    });

    it('should get level', async () => {
        const log = new Logger('test_basic.ts');

        log.setLevel('fatal');
        expect(log.level_name).to.equal('fatal');

        log.setLevel('error');
        expect(log.level_name).to.equal('error');
    });
});
