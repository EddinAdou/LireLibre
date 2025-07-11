<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthControllerTest extends WebTestCase
{
    public function testRegisterSuccess()
    {
        $client = static::createClient();
        
        $userData = [
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => 'Test123456!',
            'firstName' => 'John',
            'lastName' => 'Doe'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('token', $data);
        $this->assertArrayHasKey('user', $data);
        $this->assertEquals($userData['email'], $data['user']['email']);
        $this->assertEquals($userData['username'], $data['user']['username']);
        $this->assertEquals($userData['firstName'], $data['user']['firstName']);
        $this->assertEquals($userData['lastName'], $data['user']['lastName']);
    }

    public function testRegisterWithExistingEmail()
    {
        $client = static::createClient();
        
        // Premier utilisateur
        $userData = [
            'email' => 'existing@example.com',
            'username' => 'firstuser',
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        // Tentative d'inscription avec le même email
        $userData2 = [
            'email' => 'existing@example.com',
            'username' => 'seconduser',
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData2)
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_CONFLICT, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertStringContainsString('email already exists', $data['error']);
    }

    public function testRegisterWithExistingUsername()
    {
        $client = static::createClient();
        
        // Premier utilisateur
        $userData = [
            'email' => 'user1@example.com',
            'username' => 'sameusername',
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        // Tentative d'inscription avec le même username
        $userData2 = [
            'email' => 'user2@example.com',
            'username' => 'sameusername',
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData2)
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_CONFLICT, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertStringContainsString('Username already taken', $data['error']);
    }

    public function testRegisterWithMissingFields()
    {
        $client = static::createClient();
        
        $userData = [
            'email' => 'test@example.com',
            // username manquant
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertStringContainsString('Missing required fields', $data['error']);
    }

    public function testRegisterWithInvalidEmail()
    {
        $client = static::createClient();
        
        $userData = [
            'email' => 'invalid-email',
            'username' => 'testuser',
            'password' => 'Test123456!'
        ];

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
        $this->assertEquals('Validation failed', $data['error']);
    }
}
