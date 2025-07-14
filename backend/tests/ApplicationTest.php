<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ApplicationTest extends KernelTestCase
{
    public function testBasicMath(): void
    {
        $result = 2 + 2;
        if ($result !== 4) {
            throw new \Exception("Expected 4, got $result");
        }
        // Test passes
        $this->assertTrue(true);
    }

    public function testStringComparison(): void
    {
        $string = 'Hello World';
        if (strpos($string, 'World') === false) {
            throw new \Exception("String should contain 'World'");
        }
        // Test passes
        $this->assertTrue(true);
    }

    public function testArrayOperations(): void
    {
        $array = ['apple', 'banana', 'cherry'];
        if (count($array) !== 3) {
            throw new \Exception("Array should have 3 elements");
        }
        if (!in_array('apple', $array)) {
            throw new \Exception("Array should contain 'apple'");
        }
        // Test passes
        $this->assertTrue(true);
    }

    public function testKernelBoot(): void
    {
        $kernel = self::bootKernel();
        if ($kernel->getEnvironment() !== 'test') {
            throw new \Exception("Environment should be 'test'");
        }
        // Test passes
        $this->assertTrue(true);
    }

    public function testServiceContainer(): void
    {
        self::bootKernel();
        $container = self::getContainer();
        if ($container === null) {
            throw new \Exception("Container should not be null");
        }
        // Test passes
        $this->assertTrue(true);
    }
}
