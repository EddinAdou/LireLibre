<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;

class ApplicationTest extends TestCase
{
    public function testBasicMath(): void
    {
        $result = 2 + 2;
        $this->assertEquals(4, $result);
    }

    public function testStringComparison(): void
    {
        $string = 'Hello World';
        $this->assertStringContainsString('World', $string);
    }

    public function testArrayOperations(): void
    {
        $array = ['apple', 'banana', 'cherry'];
        $this->assertCount(3, $array);
        $this->assertContains('apple', $array);
    }

    public function testBooleanAssertions(): void
    {
        $this->assertTrue(true);
        $this->assertFalse(false);
    }
}
